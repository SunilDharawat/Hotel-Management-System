const ExcelJS = require("exceljs");
const db = require("../config/database");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Payment = require("../models/Payment");
const Customer = require("../models/Customer");
const {
  parseISO,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWithinInterval,
} = require("date-fns");

class ReportController {
  // Get occupancy report data
  static async getOccupancyReport(req, res) {
    try {
      const { startDate, endDate, roomType } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      const start = parseISO(startDate);
      const end = parseISO(endDate);

      // Get all rooms with filters
      let roomFilter = "";
      let roomParams = [];
      if (roomType && roomType !== "all") {
        roomFilter = "WHERE type = ?";
        roomParams = [roomType];
      }

      const [rooms] = await db.execute(
        `SELECT * FROM rooms ${roomFilter} ORDER BY type, room_number`,
        roomParams,
      );

      // Get bookings in the date range with room info
      const [bookings] = await db.execute(
        `SELECT b.*, r.type as room_type
         FROM bookings b
         LEFT JOIN rooms r ON b.room_id = r.id
         WHERE (b.check_in_date BETWEEN ? AND ? 
                OR b.check_out_date BETWEEN ? AND ?
                OR (b.check_in_date <= ? AND b.check_out_date >= ?))
         ORDER BY b.check_in_date`,
        [startDate, endDate, startDate, endDate, startDate, endDate],
      );

      // Calculate occupancy data
      const totalRooms = rooms.length;
      const totalRoomDays =
        totalRooms * eachDayOfInterval({ start, end }).length;

      let occupiedRoomDays = 0;
      const occupancyByDate = {};
      const occupancyByRoomType = {};

      // Process each day in the range
      const days = eachDayOfInterval({ start, end });

      days.forEach((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        let occupiedCount = 0;

        rooms.forEach((room) => {
          const isOccupied = bookings.some(
            (booking) =>
              booking.room_id === room.id &&
              booking.status === "confirmed" &&
              isWithinInterval(day, {
                start: parseISO(booking.check_in_date),
                end: parseISO(booking.check_out_date),
              }),
          );

          if (isOccupied) {
            occupiedCount++;
            occupiedRoomDays++;
          }
        });

        occupancyByDate[dateStr] = {
          total: totalRooms,
          occupied: occupiedCount,
          available: totalRooms - occupiedCount,
          occupancyRate:
            totalRooms > 0
              ? ((occupiedCount / totalRooms) * 100).toFixed(2)
              : 0,
        };
      });

      // Calculate occupancy by room type
      rooms.forEach((room) => {
        if (!occupancyByRoomType[room.type]) {
          occupancyByRoomType[room.type] = {
            total: 0,
            occupied: 0,
          };
        }
        occupancyByRoomType[room.type].total++;
      });

      bookings.forEach((booking) => {
        const room = rooms.find((r) => r.id === booking.room_id);
        if (room && booking.status === "confirmed") {
          occupancyByRoomType[room.type].occupied++;
        }
      });

      // Calculate final occupancy rates
      Object.keys(occupancyByRoomType).forEach((roomType) => {
        const data = occupancyByRoomType[roomType];
        data.occupancyRate =
          data.total > 0 ? ((data.occupied / data.total) * 100).toFixed(2) : 0;
      });

      const overallOccupancyRate =
        totalRoomDays > 0
          ? ((occupiedRoomDays / totalRoomDays) * 100).toFixed(2)
          : 0;

      res.json({
        success: true,
        data: {
          summary: {
            totalRooms,
            totalRoomDays,
            occupiedRoomDays,
            overallOccupancyRate,
            dateRange: { startDate, endDate },
          },
          occupancyByDate,
          occupancyByRoomType,
        },
      });
    } catch (error) {
      console.error("Error generating occupancy report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate occupancy report",
      });
    }
  }

  // Get revenue report data
  static async getRevenueReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      // Get payments in the date range
      const payments = await Payment.getByDateRange(startDate, endDate);

      // Get booking details for revenue calculation using a single query
      const [bookingDetails] = await db.execute(
        `SELECT 
  p.id AS payment_id,
  i.booking_id AS booking_id,
  p.amount,
  i.total_gst AS gst_amount,
  p.payment_date,
  p.payment_method,

  b.customer_id,
  b.room_id,

  c.full_name AS customer_name,
  r.type AS room_type

FROM payments p
LEFT JOIN invoices i ON p.invoice_id = i.id
LEFT JOIN bookings b ON i.booking_id = b.id
LEFT JOIN customers c ON b.customer_id = c.id
LEFT JOIN rooms r ON b.room_id = r.id

WHERE p.payment_date BETWEEN ? AND ?
ORDER BY p.payment_date DESC;
`,
        [startDate, endDate],
      );

      const revenueByDate = {};
      const revenueByRoomType = {};
      const revenueByPaymentMethod = {};
      let totalRevenue = 0;
      let totalGST = 0;

      bookingDetails.forEach((payment) => {
        const dateStr = format(payment.payment_date, "yyyy-MM-dd");

        const amount = parseFloat(payment.amount);
        const gstAmount = parseFloat(payment.gst_amount || 0);
        const netAmount = amount - gstAmount;

        // Initialize date entry
        if (!revenueByDate[dateStr]) {
          revenueByDate[dateStr] = {
            grossRevenue: 0,
            netRevenue: 0,
            gstAmount: 0,
            bookingCount: 0,
          };
        }

        // Update date totals
        revenueByDate[dateStr].grossRevenue += amount;
        revenueByDate[dateStr].netRevenue += netAmount;
        revenueByDate[dateStr].gstAmount += gstAmount;
        revenueByDate[dateStr].bookingCount++;

        // Update room type totals
        if (payment.room_type) {
          if (!revenueByRoomType[payment.room_type]) {
            revenueByRoomType[payment.room_type] = {
              grossRevenue: 0,
              netRevenue: 0,
              gstAmount: 0,
              bookingCount: 0,
            };
          }
          revenueByRoomType[payment.room_type].grossRevenue += amount;
          revenueByRoomType[payment.room_type].netRevenue += netAmount;
          revenueByRoomType[payment.room_type].gstAmount += gstAmount;
          revenueByRoomType[payment.room_type].bookingCount++;
        }

        // Update payment method totals
        if (!revenueByPaymentMethod[payment.payment_method]) {
          revenueByPaymentMethod[payment.payment_method] = {
            amount: 0,
            count: 0,
          };
        }
        revenueByPaymentMethod[payment.payment_method].amount += amount;
        revenueByPaymentMethod[payment.payment_method].count++;

        // Update grand totals
        totalRevenue += amount;
        totalGST += gstAmount;
      });

      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalGST,
            netRevenue: totalRevenue - totalGST,
            totalTransactions: payments.length,
            dateRange: { startDate, endDate },
          },
          revenueByDate,
          revenueByRoomType,
          revenueByPaymentMethod,
        },
      });
    } catch (error) {
      console.error("Error generating revenue report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate revenue report",
      });
    }
  }

  // Get booking report data
  static async getBookingReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      const bookings = await Booking.getByDateRange(startDate, endDate);

      const bookingStats = {
        total: bookings.length,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0,
      };

      const bookingsByStatus = {};
      const bookingsByRoomType = {};
      const bookingsBySource = {};
      const averageLengthOfStay = 0;
      let totalNights = 0;

      bookings.forEach((booking) => {
        // Status statistics
        bookingStats[booking.status] = (bookingStats[booking.status] || 0) + 1;

        // By status
        if (!bookingsByStatus[booking.status]) {
          bookingsByStatus[booking.status] = 0;
        }
        bookingsByStatus[booking.status]++;

        // By room type
        if (booking.room_type) {
          if (!bookingsByRoomType[booking.room_type]) {
            bookingsByRoomType[booking.room_type] = 0;
          }
          bookingsByRoomType[booking.room_type]++;
        }

        // By source
        const source = booking.source || "direct";
        if (!bookingsBySource[source]) {
          bookingsBySource[source] = 0;
        }
        bookingsBySource[source]++;

        // Calculate nights
        const nights = Math.ceil(
          (new Date(booking.check_out_date) - new Date(booking.check_in_date)) /
            (1000 * 60 * 60 * 24),
        );
        totalNights += nights;
      });

      const avgLengthOfStay =
        bookings.length > 0 ? (totalNights / bookings.length).toFixed(2) : 0;

      res.json({
        success: true,
        data: {
          summary: {
            ...bookingStats,
            averageLengthOfStay: avgLengthOfStay,
            dateRange: { startDate, endDate },
          },
          bookingsByStatus,
          bookingsByRoomType,
          bookingsBySource,
        },
      });
    } catch (error) {
      console.error("Error generating booking report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate booking report",
      });
    }
  }

  // Get customer report data
  static async getCustomerReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const customers = await Customer.getAll();
      const bookings = await Booking.getByDateRange(startDate, endDate);

      // Customer statistics with proper queries
      const [newCustomersData] = await db.execute(
        `SELECT COUNT(DISTINCT c.id) as new_customers
         FROM customers c
         INNER JOIN bookings b ON c.id = b.customer_id
         WHERE b.created_at BETWEEN ? AND ?`,
        [startDate, endDate],
      );

      const [repeatCustomersData] = await db.execute(
        `SELECT COUNT(DISTINCT c.id) as repeat_customers
         FROM customers c
         INNER JOIN bookings b ON c.id = b.customer_id
         WHERE b.created_at < ?
         GROUP BY c.id
         HAVING COUNT(b.id) > 1`,
        [startDate],
      );

      const totalCustomers = customers.length;
      const newCustomers = newCustomersData[0]?.new_customers || 0;
      const repeatCustomers = repeatCustomersData[0]?.repeat_customers || 0;

      // Customer demographics
      const customersByCity = {};
      const customersByState = {};
      const customersByCountry = {};

      customers.forEach((customer) => {
        if (customer.city) {
          customersByCity[customer.city] =
            (customersByCity[customer.city] || 0) + 1;
        }
        if (customer.state) {
          customersByState[customer.state] =
            (customersByState[customer.state] || 0) + 1;
        }
        if (customer.country) {
          customersByCountry[customer.country] =
            (customersByCountry[customer.country] || 0) + 1;
        }
      });

      // Top customers by revenue using a single optimized query
      const [topCustomersData] = await db.execute(
        `SELECT 
          c.id as customer_id,
          c.full_name as customer_name,
          COUNT(DISTINCT b.id) as booking_count,
          COALESCE(SUM(p.amount), 0) as total_revenue
         FROM customers c
         LEFT JOIN bookings b ON c.id = b.customer_id
         LEFT JOIN invoices i ON b.id = i.booking_id
         LEFT JOIN payments p ON i.id = p.invoice_id
         WHERE (b.check_in_date BETWEEN ? AND ? OR b.check_in_date IS NULL)
         GROUP BY c.id, c.full_name
         HAVING total_revenue > 0
         ORDER BY total_revenue DESC
         LIMIT 10`,
        [startDate, endDate],
      );

      const topCustomers = topCustomersData.map((item) => ({
        customer: {
          id: item.customer_id,
          name: item.customer_name || "Unknown Customer",
        },
        totalRevenue: parseFloat(item.total_revenue),
        bookingCount: parseInt(item.booking_count),
      }));

      res.json({
        success: true,
        data: {
          summary: {
            totalCustomers,
            newCustomers,
            repeatCustomers,
            repeatCustomerRate:
              totalCustomers > 0
                ? ((repeatCustomers / totalCustomers) * 100).toFixed(2)
                : 0,
            dateRange: { startDate, endDate },
          },
          customersByCity,
          customersByState,
          customersByCountry,
          topCustomers,
        },
      });
    } catch (error) {
      console.error("Error generating customer report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate customer report",
      });
    }
  }

  // Export occupancy report to Excel
  static async exportOccupancyReport(req, res) {
    try {
      const { startDate, endDate, roomType } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      // Get the same data as the regular report
      const reportData = await ReportController.getOccupancyReportData(
        startDate,
        endDate,
        roomType,
      );

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();

      // Summary sheet
      const summarySheet = workbook.addWorksheet("Summary");
      summarySheet.addRow("Occupancy Report Summary");
      summarySheet.addRow("");
      summarySheet.addRow("Report Period:", `${startDate} to ${endDate}`);
      summarySheet.addRow("Total Rooms:", reportData.summary.totalRooms);
      summarySheet.addRow(
        "Overall Occupancy Rate:",
        `${reportData.summary.overallOccupancyRate}%`,
      );
      summarySheet.addRow("Generated On:", new Date().toLocaleString());

      // Daily occupancy sheet
      const dailySheet = workbook.addWorksheet("Daily Occupancy");
      dailySheet.addRow("Date");
      dailySheet.addRow("Total Rooms");
      dailySheet.addRow("Occupied Rooms");
      dailySheet.addRow("Available Rooms");
      dailySheet.addRow("Occupancy Rate (%)");

      Object.entries(reportData.occupancyByDate).forEach(([date, data]) => {
        dailySheet.addRow([
          date,
          data.total,
          data.occupied,
          data.available,
          data.occupancyRate,
        ]);
      });

      // Room type occupancy sheet
      const roomTypeSheet = workbook.addWorksheet("Room Type Occupancy");
      roomTypeSheet.addRow("Room Type");
      roomTypeSheet.addRow("Total Rooms");
      roomTypeSheet.addRow("Occupied Rooms");
      roomTypeSheet.addRow("Occupancy Rate (%)");

      Object.entries(reportData.occupancyByRoomType).forEach(
        ([roomType, data]) => {
          roomTypeSheet.addRow([
            roomType,
            data.total,
            data.occupied,
            data.occupancyRate,
          ]);
        },
      );

      // Style the headers
      [summarySheet, dailySheet, roomTypeSheet].forEach((sheet) => {
        sheet.getRow(1).font = { bold: true };
        sheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE6E6FA" },
        };
      });

      // Set up response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=occupancy-report-${startDate}-to-${endDate}.xlsx`,
      );

      // Send the file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error exporting occupancy report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export occupancy report",
      });
    }
  }

  // Export revenue report to Excel
  static async exportRevenueReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      // Get the same data as the regular report
      const reportData = await ReportController.getRevenueReportData(
        startDate,
        endDate,
      );

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();

      // Summary sheet
      const summarySheet = workbook.addWorksheet("Summary");
      summarySheet.addRow("Revenue Report Summary");
      summarySheet.addRow("");
      summarySheet.addRow("Report Period:", `${startDate} to ${endDate}`);
      summarySheet.addRow(
        "Total Revenue:",
        `₹${reportData.summary.totalRevenue.toFixed(2)}`,
      );
      summarySheet.addRow(
        "Total GST:",
        `₹${reportData.summary.totalGST.toFixed(2)}`,
      );
      summarySheet.addRow(
        "Net Revenue:",
        `₹${reportData.summary.netRevenue.toFixed(2)}`,
      );
      summarySheet.addRow(
        "Total Transactions:",
        reportData.summary.totalTransactions,
      );
      summarySheet.addRow("Generated On:", new Date().toLocaleString());

      // Daily revenue sheet
      const dailySheet = workbook.addWorksheet("Daily Revenue");
      dailySheet.addRow("Date");
      dailySheet.addRow("Gross Revenue");
      dailySheet.addRow("Net Revenue");
      dailySheet.addRow("GST Amount");
      dailySheet.addRow("Booking Count");

      Object.entries(reportData.revenueByDate).forEach(([date, data]) => {
        dailySheet.addRow([
          date,
          data.grossRevenue,
          data.netRevenue,
          data.gstAmount,
          data.bookingCount,
        ]);
      });

      // Room type revenue sheet
      const roomTypeSheet = workbook.addWorksheet("Room Type Revenue");
      roomTypeSheet.addRow("Room Type");
      roomTypeSheet.addRow("Gross Revenue");
      roomTypeSheet.addRow("Net Revenue");
      roomTypeSheet.addRow("GST Amount");
      roomTypeSheet.addRow("Booking Count");

      Object.entries(reportData.revenueByRoomType).forEach(
        ([roomType, data]) => {
          roomTypeSheet.addRow([
            roomType,
            data.grossRevenue,
            data.netRevenue,
            data.gstAmount,
            data.bookingCount,
          ]);
        },
      );

      // Payment method sheet
      const paymentSheet = workbook.addWorksheet("Payment Methods");
      paymentSheet.addRow("Payment Method");
      paymentSheet.addRow("Total Amount");
      paymentSheet.addRow("Transaction Count");

      Object.entries(reportData.revenueByPaymentMethod).forEach(
        ([method, data]) => {
          paymentSheet.addRow([method, data.amount, data.count]);
        },
      );

      // Style the headers
      [summarySheet, dailySheet, roomTypeSheet, paymentSheet].forEach(
        (sheet) => {
          sheet.getRow(1).font = { bold: true };
          sheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6FA" },
          };
        },
      );

      // Set up response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=revenue-report-${startDate}-to-${endDate}.xlsx`,
      );

      // Send the file
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error exporting revenue report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export revenue report",
      });
    }
  }

  // Helper method to get occupancy report data (used by both regular and export methods)
  static async getOccupancyReportData(startDate, endDate, roomType) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Get all rooms with filters
    let roomFilter = "";
    let roomParams = [];
    if (roomType && roomType !== "all") {
      roomFilter = "WHERE type = ?";
      roomParams = [roomType];
    }

    const [rooms] = await db.execute(
      `SELECT * FROM rooms ${roomFilter} ORDER BY type, room_number`,
      roomParams,
    );

    // Get bookings in the date range with room info
    const [bookings] = await db.execute(
      `SELECT b.*, r.type as room_type
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id = r.id
       WHERE (b.check_in_date BETWEEN ? AND ? 
              OR b.check_out_date BETWEEN ? AND ?
              OR (b.check_in_date <= ? AND b.check_out_date >= ?))
       ORDER BY b.check_in_date`,
      [startDate, endDate, startDate, endDate, startDate, endDate],
    );

    // Calculate occupancy data
    const totalRooms = rooms.length;
    const totalRoomDays = totalRooms * eachDayOfInterval({ start, end }).length;

    let occupiedRoomDays = 0;
    const occupancyByDate = {};
    const occupancyByRoomType = {};

    // Process each day in the range
    const days = eachDayOfInterval({ start, end });

    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      let occupiedCount = 0;

      rooms.forEach((room) => {
        const isOccupied = bookings.some(
          (booking) =>
            booking.room_id === room.id &&
            booking.status === "confirmed" &&
            isWithinInterval(day, {
              start: parseISO(booking.check_in_date),
              end: parseISO(booking.check_out_date),
            }),
        );

        if (isOccupied) {
          occupiedCount++;
          occupiedRoomDays++;
        }
      });

      occupancyByDate[dateStr] = {
        total: totalRooms,
        occupied: occupiedCount,
        available: totalRooms - occupiedCount,
        occupancyRate:
          totalRooms > 0 ? ((occupiedCount / totalRooms) * 100).toFixed(2) : 0,
      };
    });

    // Calculate occupancy by room type
    rooms.forEach((room) => {
      if (!occupancyByRoomType[room.type]) {
        occupancyByRoomType[room.type] = {
          total: 0,
          occupied: 0,
        };
      }
      occupancyByRoomType[room.type].total++;
    });

    bookings.forEach((booking) => {
      const room = rooms.find((r) => r.id === booking.room_id);
      if (room && booking.status === "confirmed") {
        occupancyByRoomType[room.type].occupied++;
      }
    });

    // Calculate final occupancy rates
    Object.keys(occupancyByRoomType).forEach((roomType) => {
      const data = occupancyByRoomType[roomType];
      data.occupancyRate =
        data.total > 0 ? ((data.occupied / data.total) * 100).toFixed(2) : 0;
    });

    const overallOccupancyRate =
      totalRoomDays > 0
        ? ((occupiedRoomDays / totalRoomDays) * 100).toFixed(2)
        : 0;

    return {
      summary: {
        totalRooms,
        totalRoomDays,
        occupiedRoomDays,
        overallOccupancyRate,
        dateRange: { startDate, endDate },
      },
      occupancyByDate,
      occupancyByRoomType,
    };
  }

  // Helper method to get revenue report data (used by both regular and export methods)
  static async getRevenueReportData(startDate, endDate) {
    // Get booking details for revenue calculation using a single query
    const [bookingDetails] = await db.execute(
      `SELECT 
        p.id as payment_id, i.booking_id as booking_id, p.amount, i.total_gst as gst_amount, p.payment_date, p.payment_method,
        b.id, b.customer_id, b.room_id,
        c.full_name as customer_name,
        r.type as room_type
       FROM payments p
       LEFT JOIN invoices i ON p.invoice_id = i.id
       LEFT JOIN bookings b ON i.booking_id = b.id
       LEFT JOIN customers c ON b.customer_id = c.id
       LEFT JOIN rooms r ON b.room_id = r.id
       WHERE DATE(p.payment_date) BETWEEN ? AND ?
       ORDER BY p.payment_date DESC`,
      [startDate, endDate],
    );

    const revenueByDate = {};
    const revenueByRoomType = {};
    const revenueByPaymentMethod = {};
    let totalRevenue = 0;
    let totalGST = 0;

    bookingDetails.forEach((payment) => {
      const dateStr = format(payment.payment_date, "yyyy-MM-dd");

      const amount = parseFloat(payment.amount);
      const gstAmount = parseFloat(payment.gst_amount || 0);
      const netAmount = amount - gstAmount;

      // Initialize date entry
      if (!revenueByDate[dateStr]) {
        revenueByDate[dateStr] = {
          grossRevenue: 0,
          netRevenue: 0,
          gstAmount: 0,
          bookingCount: 0,
        };
      }

      // Update date totals
      revenueByDate[dateStr].grossRevenue += amount;
      revenueByDate[dateStr].netRevenue += netAmount;
      revenueByDate[dateStr].gstAmount += gstAmount;
      revenueByDate[dateStr].bookingCount++;

      // Update room type totals
      if (payment.room_type) {
        if (!revenueByRoomType[payment.room_type]) {
          revenueByRoomType[payment.room_type] = {
            grossRevenue: 0,
            netRevenue: 0,
            gstAmount: 0,
            bookingCount: 0,
          };
        }
        revenueByRoomType[payment.room_type].grossRevenue += amount;
        revenueByRoomType[payment.room_type].netRevenue += netAmount;
        revenueByRoomType[payment.room_type].gstAmount += gstAmount;
        revenueByRoomType[payment.room_type].bookingCount++;
      }

      // Update payment method totals
      if (!revenueByPaymentMethod[payment.payment_method]) {
        revenueByPaymentMethod[payment.payment_method] = {
          amount: 0,
          count: 0,
        };
      }
      revenueByPaymentMethod[payment.payment_method].amount += amount;
      revenueByPaymentMethod[payment.payment_method].count++;

      // Update grand totals
      totalRevenue += amount;
      totalGST += gstAmount;
    });

    return {
      summary: {
        totalRevenue,
        totalGST,
        netRevenue: totalRevenue - totalGST,
        totalTransactions: bookingDetails.length,
        dateRange: { startDate, endDate },
      },
      revenueByDate,
      revenueByRoomType,
      revenueByPaymentMethod,
    };
  }
}

module.exports = ReportController;
