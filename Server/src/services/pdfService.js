// // // const PDFDocument = require("pdfkit");
// // // const fs = require("fs");
// // // const path = require("path");

// // // class PDFService {
// // //   /**
// // //    * Generate invoice PDF
// // //    */
// // //   static async generateInvoicePDF(invoice) {
// // //     return new Promise((resolve, reject) => {
// // //       try {
// // //         const doc = new PDFDocument({ margin: 50, size: "A4" });

// // //         const invoiceDir = path.join(__dirname, "../../invoices");
// // //         if (!fs.existsSync(invoiceDir)) {
// // //           fs.mkdirSync(invoiceDir, { recursive: true });
// // //         }

// // //         const filename = `${invoice.invoice_number}.pdf`;
// // //         const filepath = path.join(invoiceDir, filename);

// // //         const stream = fs.createWriteStream(filepath);
// // //         doc.pipe(stream);

// // //         /* ================= HEADER ================= */
// // //         doc.fontSize(20).text("VRINDAVAN PALACE", { align: "center" });
// // //         doc.fontSize(10).text("123 Main Street, City", { align: "center" });
// // //         doc.text("Phone: +91-9876543210 | Email: info@vrindavanpalace.com", {
// // //           align: "center",
// // //         });
// // //         doc.text("GST No: 29ABCDE1234F1Z5", { align: "center" });
// // //         doc.moveDown();

// // //         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
// // //         doc.moveDown();

// // //         doc.fontSize(16).text("TAX INVOICE", { align: "center" });
// // //         doc.moveDown();

// // //         /* ================= INVOICE INFO ================= */
// // //         doc.fontSize(10);
// // //         doc.text(`Invoice No: ${invoice.invoice_number}`, 50, doc.y);
// // //         doc.text(
// // //           `Date: ${new Date(invoice.created_at).toLocaleDateString("en-IN")}`,
// // //           400,
// // //           doc.y - 12
// // //         );

// // //         doc.moveDown();

// // //         /* ================= CUSTOMER ================= */
// // //         doc.fontSize(12).text("Bill To:", { underline: true });
// // //         doc.fontSize(10);
// // //         doc.text(`Name: ${invoice.customer_name}`);
// // //         doc.text(`Phone: ${invoice.customer_phone}`);
// // //         if (invoice.customer_email) {
// // //           doc.text(`Email: ${invoice.customer_email}`);
// // //         }
// // //         doc.moveDown();

// // //         /* ================= ITEMS ================= */
// // //         doc.font("Helvetica-Bold");
// // //         doc.text("Description", 50);
// // //         doc.text("Qty", 300);
// // //         doc.text("Rate", 360);
// // //         doc.text("Amount", 450);
// // //         doc.moveDown();

// // //         doc.font("Helvetica");

// // //         invoice.items.forEach((item) => {
// // //           doc.text(item.description, 50);
// // //           doc.text(item.quantity.toString(), 300);
// // //           doc.text(`${item.unit_price}`, 360);
// // //           doc.text(`${item.total_price}`, 450);
// // //           doc.moveDown();
// // //         });

// // //         /* ================= TOTAL ================= */
// // //         doc.moveDown();
// // //         doc.font("Helvetica-Bold");
// // //         doc.text(`Total Amount: ${invoice.total_amount}`, { align: "right" });

// // //         if (invoice.special_requests) {
// // //           doc.moveDown();
// // //           doc.font("Helvetica");
// // //           doc.text(`Special Requests: ${invoice.special_requests}`);
// // //         }

// // //         doc.end();

// // //         stream.on("finish", () => resolve(filepath));
// // //         stream.on("error", reject);
// // //       } catch (err) {
// // //         reject(err);
// // //       }
// // //     });
// // //   }
// // // }

// // // module.exports = PDFService;

// // const PDFDocument = require("pdfkit");
// // const fs = require("fs");
// // const path = require("path");

// // class PDFService {
// //   /**
// //    * Generate invoice PDF with professional formatting
// //    */
// //   static async generateInvoicePDF(invoice, settings = {}) {
// //     return new Promise((resolve, reject) => {
// //       try {
// //         const doc = new PDFDocument({ margin: 50, size: "A4" });

// //         // Ensure invoices directory exists
// //         const invoiceDir = path.join(__dirname, "../../invoices");
// //         if (!fs.existsSync(invoiceDir)) {
// //           fs.mkdirSync(invoiceDir, { recursive: true });
// //         }

// //         const filename = `${invoice.invoice_number}.pdf`;
// //         const filepath = path.join(invoiceDir, filename);

// //         const stream = fs.createWriteStream(filepath);
// //         doc.pipe(stream);

// //         // Colors
// //         const primaryColor = "#1e3a8a";
// //         const grayColor = "#666666";
// //         const lightGray = "#f3f4f6";

// //         /* ================= HEADER ================= */
// //         doc.fillColor(primaryColor);
// //         doc
// //           .fontSize(24)
// //           .font("Helvetica-Bold")
// //           .text(settings.general?.name || "VRINDAVAN PALACE", {
// //             align: "center",
// //           });

// //         doc.fillColor(grayColor).fontSize(10).font("Helvetica");
// //         doc.text(settings.general?.address || "123 Main Street, City", {
// //           align: "center",
// //         });
// //         doc.text(
// //           `Phone: ${settings.general?.phone || "+91-9876543210"} | Email: ${
// //             settings.general?.email || "info@vrindavanpalace.com"
// //           }`,
// //           { align: "center" }
// //         );
// //         doc.text(
// //           `GST No: ${settings.general?.gst_number || "29ABCDE1234F1Z5"}`,
// //           { align: "center" }
// //         );

// //         doc.moveDown(0.5);
// //         doc
// //           .moveTo(50, doc.y)
// //           .lineTo(doc.page.width - 50, doc.y)
// //           .lineWidth(2)
// //           .strokeColor(primaryColor)
// //           .stroke();
// //         doc.moveDown();

// //         /* ================= INVOICE TITLE ================= */
// //         doc.fillColor(primaryColor).fontSize(18).font("Helvetica-Bold");
// //         doc.text("TAX INVOICE", { align: "center" });
// //         doc.moveDown();

// //         /* ================= INVOICE & GUEST INFO ================= */
// //         const startY = doc.y;

// //         // Left side - Invoice Details
// //         doc.fillColor("#000").fontSize(9).font("Helvetica-Bold");
// //         doc.text("INVOICE DETAILS", 50, startY);
// //         doc.fontSize(9).font("Helvetica").fillColor(grayColor);
// //         doc.text(`Invoice No: ${invoice.invoice_number}`, 50, doc.y + 5);
// //         doc.text(
// //           `Date: ${new Date(invoice.created_at).toLocaleDateString("en-IN", {
// //             year: "numeric",
// //             month: "long",
// //             day: "numeric",
// //           })}`,
// //           50,
// //           doc.y + 2
// //         );
// //         if (invoice.booking_number) {
// //           doc.text(`Booking No: ${invoice.booking_number}`, 50, doc.y + 2);
// //         }

// //         // Right side - Guest Details
// //         doc.fillColor("#000").fontSize(9).font("Helvetica-Bold");
// //         doc.text("GUEST DETAILS", 350, startY);
// //         doc.fontSize(9).font("Helvetica").fillColor(grayColor);
// //         doc.text(invoice.customer_name, 350, startY + 15);
// //         doc.text(invoice.customer_phone || "", 350, doc.y + 2);
// //         if (invoice.customer_email) {
// //           doc.text(invoice.customer_email, 350, doc.y + 2);
// //         }

// //         doc.moveDown(2);

// //         /* ================= ITEMS TABLE ================= */
// //         const tableTop = doc.y + 10;

// //         // Table header background
// //         doc
// //           .rect(50, tableTop - 5, doc.page.width - 100, 25)
// //           .fillColor(lightGray)
// //           .fill();

// //         // Table headers
// //         doc.fillColor("#000").fontSize(9).font("Helvetica-Bold");
// //         doc.text("DESCRIPTION", 55, tableTop);
// //         doc.text("QTY", 340, tableTop, { width: 40, align: "center" });
// //         doc.text("RATE", 390, tableTop, { width: 70, align: "right" });
// //         doc.text("AMOUNT", 470, tableTop, { width: 75, align: "right" });

// //         let yPosition = tableTop + 30;

// //         // Table items
// //         doc.font("Helvetica").fontSize(9).fillColor("#333");

// //         invoice.items.forEach((item, index) => {
// //           if (yPosition > 700) {
// //             doc.addPage();
// //             yPosition = 50;
// //           }

// //           // Item description with category badge
// //           const descriptionLines = doc.heightOfString(item.description, {
// //             width: 270,
// //           });

// //           if (item.category) {
// //             doc.fontSize(7).fillColor("#666");
// //             doc
// //               .rect(55, yPosition - 2, 45, 12)
// //               .fillColor("#e0e7ff")
// //               .fill();
// //             doc
// //               .fillColor("#3730a3")
// //               .text(item.category.toUpperCase(), 60, yPosition, {
// //                 width: 40,
// //                 align: "center",
// //               });
// //             doc.fillColor("#333").fontSize(9);
// //             doc.text(item.description, 105, yPosition, { width: 225 });
// //           } else {
// //             doc.text(item.description, 55, yPosition, { width: 270 });
// //           }

// //           doc.text(item.quantity.toString(), 340, yPosition, {
// //             width: 40,
// //             align: "center",
// //           });
// //           doc.text(
// //             `${parseFloat(item.unit_price).toFixed(2)}`,
// //             390,
// //             yPosition,
// //             { width: 70, align: "right" }
// //           );
// //           doc
// //             .font("Helvetica-Bold")
// //             .text(
// //               `${parseFloat(item.total_price).toFixed(2)}`,
// //               470,
// //               yPosition,
// //               { width: 75, align: "right" }
// //             );
// //           doc.font("Helvetica");

// //           yPosition += Math.max(descriptionLines, 15) + 10;

// //           // Separator line
// //           doc
// //             .moveTo(50, yPosition - 5)
// //             .lineTo(doc.page.width - 50, yPosition - 5)
// //             .strokeColor("#e5e7eb")
// //             .lineWidth(0.5)
// //             .stroke();
// //         });

// //         /* ================= TOTALS SECTION ================= */
// //         doc.moveDown(2);
// //         const totalsX = 350;
// //         let totalsY = yPosition + 20;

// //         doc.fontSize(9).font("Helvetica");

// //         // Subtotal
// //         doc.fillColor("#333").text("Subtotal:", totalsX, totalsY);
// //         doc.text(
// //           `${parseFloat(invoice.subtotal).toFixed(2)}`,
// //           totalsX + 120,
// //           totalsY,
// //           { width: 75, align: "right" }
// //         );
// //         totalsY += 20;

// //         // GST
// //         doc.fillColor(grayColor).fontSize(8);
// //         doc.text(`CGST @ ${invoice.cgst_rate}%:`, totalsX, totalsY);
// //         doc.text(
// //           `${parseFloat(invoice.cgst_amount).toFixed(2)}`,
// //           totalsX + 120,
// //           totalsY,
// //           { width: 75, align: "right" }
// //         );
// //         totalsY += 15;

// //         doc.text(`SGST @ ${invoice.sgst_rate}%:`, totalsX, totalsY);
// //         doc.text(
// //           `${parseFloat(invoice.sgst_amount).toFixed(2)}`,
// //           totalsX + 120,
// //           totalsY,
// //           { width: 75, align: "right" }
// //         );
// //         totalsY += 20;

// //         // Grand Total
// //         doc
// //           .rect(totalsX - 10, totalsY - 5, 205, 25)
// //           .fillColor(lightGray)
// //           .fill();
// //         doc.fillColor("#000").fontSize(11).font("Helvetica-Bold");
// //         doc.text("GRAND TOTAL:", totalsX, totalsY);
// //         doc.text(
// //           `${parseFloat(invoice.grand_total).toFixed(2)}`,
// //           totalsX + 120,
// //           totalsY,
// //           { width: 75, align: "right" }
// //         );
// //         totalsY += 30;

// //         // Payment details
// //         if (invoice.amount_paid > 0) {
// //           doc.fontSize(9).font("Helvetica").fillColor("#059669");
// //           doc.text("Advance Paid:", totalsX, totalsY);
// //           doc.text(
// //             `(-) ${parseFloat(invoice.amount_paid).toFixed(2)}`,
// //             totalsX + 120,
// //             totalsY,
// //             { width: 75, align: "right" }
// //           );
// //           totalsY += 15;

// //           if (invoice.amount_due > 0) {
// //             doc.fillColor("#dc2626").font("Helvetica-Bold");
// //             doc.text("Balance Paid:", totalsX, totalsY);
// //             doc.text(
// //               `${parseFloat(invoice.amount_due).toFixed(2)}`,
// //               totalsX + 120,
// //               totalsY,
// //               { width: 75, align: "right" }
// //             );
// //           }
// //         }

// //         /* ================= FOOTER ================= */
// //         const footerY = doc.page.height - 100;
// //         doc
// //           .moveTo(50, footerY)
// //           .lineTo(doc.page.width - 50, footerY)
// //           .strokeColor("#e5e7eb")
// //           .lineWidth(1)
// //           .stroke();

// //         doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor);
// //         doc.text(
// //           `Thank you for choosing ${
// //             settings.general?.name || "Vrindavan Palace"
// //           }!`,
// //           50,
// //           footerY + 15,
// //           { align: "center" }
// //         );

// //         doc.fontSize(8).font("Helvetica").fillColor(grayColor);
// //         doc.text(
// //           "We hope you enjoyed your stay and look forward to welcoming you again.",
// //           50,
// //           footerY + 35,
// //           { align: "center" }
// //         );

// //         doc.fontSize(7).fillColor("#999");
// //         doc.text(
// //           "This is a computer-generated invoice and does not require a signature.",
// //           50,
// //           footerY + 55,
// //           { align: "center" }
// //         );

// //         doc.end();

// //         stream.on("finish", () => {
// //           resolve({
// //             filepath,
// //             filename,
// //           });
// //         });

// //         stream.on("error", (error) => {
// //           reject(error);
// //         });
// //       } catch (error) {
// //         reject(error);
// //       }
// //     });
// //   }
// // }

// // module.exports = PDFService;
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// class PDFService {
//   static async generateInvoicePDF(invoice, settings = {}) {
//     console.log("Generating invoice PDF...", invoice);
//     return new Promise((resolve, reject) => {
//       try {
//         const doc = new PDFDocument({ margin: 40, size: "A4" });

//         const invoiceDir = path.join(__dirname, "../../invoices");
//         if (!fs.existsSync(invoiceDir)) {
//           fs.mkdirSync(invoiceDir, { recursive: true });
//         }

//         const filename = `${invoice.invoice_number}.pdf`;
//         const filepath = path.join(invoiceDir, filename);

//         const stream = fs.createWriteStream(filepath);
//         doc.pipe(stream);

//         // Helper for Dates
//         const formatDate = (date) =>
//           date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

//         // Colors
//         const primaryColor = "#1e3a8a";
//         const grayColor = "#444444";
//         const lightGray = "#f3f4f6";

//         /* ================= LOGO & HEADER ================= */
//         const logoPath = path.join(__dirname, "../../public/HMS_Logo.png");
//         if (fs.existsSync(logoPath)) {
//           doc.image(logoPath, 40, 40, { width: 60 });
//         }

//         doc
//           .fillColor(primaryColor)
//           .fontSize(20)
//           .font("Helvetica-Bold")
//           .text(settings.general?.name || "VRINDAVAN PALACE", 110, 40, {
//             align: "left",
//           });

//         doc.fillColor(grayColor).fontSize(9).font("Helvetica");
//         doc.text(
//           settings.general?.address || "123 Main Street, City",
//           110,
//           doc.y
//         );
//         doc.text(
//           `Phone: ${settings.general?.phone || "+91-9876543210"} | Email: ${
//             settings.general?.email || ""
//           }`,
//           110,
//           doc.y
//         );

//         // GST and UIN Bold (Pulling from booking object if available)
//         doc
//           .font("Helvetica-Bold")
//           .text(
//             `GST No: ${settings.general?.gst_number || "29ABCDE1234F1Z5"}`,
//             110,
//             doc.y
//           );
//         doc.text(
//           `UIN No: ${
//             invoice.booking?.uin_number || invoice.uin_number || "N/A"
//           }`,
//           110,
//           doc.y
//         );

//         doc.moveDown(1);
//         doc
//           .moveTo(40, doc.y)
//           .lineTo(555, doc.y)
//           .lineWidth(1)
//           .strokeColor(primaryColor)
//           .stroke();
//         doc.moveDown(0.5);

//         /* ================= INVOICE DETAILS ================= */
//         doc
//           .fillColor(primaryColor)
//           .fontSize(12)
//           .font("Helvetica-Bold")
//           .text("TAX INVOICE", { align: "center" });
//         doc.moveDown(0.5);

//         doc
//           .fillColor("#000")
//           .fontSize(9)
//           .font("Helvetica-Bold")
//           .text("INVOICE DETAILS", 40);
//         doc.font("Helvetica").fillColor(grayColor);
//         doc.text(`Date: ${formatDate(invoice.created_at)}`);
//         doc.text(`Invoice No: ${invoice.invoice_number}`);
//         if (invoice.booking_number)
//           doc.text(`Booking No: ${invoice.booking_number}`);

//         doc.moveDown(1);

//         /* ================= GUEST & STAY DETAILS (Side-by-Side) ================= */
//         const detailsY = doc.y;

//         // Column 1: Guest Details
//         doc
//           .fillColor("#000")
//           .font("Helvetica-Bold")
//           .text("GUEST DETAILS", 40, detailsY);
//         doc.font("Helvetica").fillColor(grayColor);
//         doc.text(`Name: ${invoice.customer_name}`, 40, doc.y + 2);
//         doc.text(`Phone: ${invoice.customer_phone || "N/A"}`, 40, doc.y + 2);
//         doc.text(`Email: ${invoice.customer_email || "N/A"}`, 40, doc.y + 2);

//         // Column 2: Stay Details (Right) - Updated to pull from invoice.booking
//         const rightColX = 320;
//         doc
//           .fillColor("#000")
//           .font("Helvetica-Bold")
//           .text("STAY DETAILS", rightColX, detailsY);
//         doc.font("Helvetica").fillColor(grayColor);
//         doc.text(
//           `Check-In: ${formatDate(invoice.booking?.check_in_date)}`,
//           rightColX,
//           doc.y + 2
//         );
//         doc.text(
//           `Check-Out: ${formatDate(invoice.booking?.check_out_date)}`,
//           rightColX,
//           doc.y + 2
//         );
//         doc.text(
//           `Room: ${invoice.booking?.room_number || invoice.room_no || "-"} (${
//             invoice.booking?.room_type || invoice.room_type || "-"
//           })`,
//           rightColX,
//           doc.y + 2
//         );
//         doc.text(
//           `No. of Persons: ${
//             invoice.booking?.number_of_guests || invoice.no_of_person || "-"
//           }`,
//           rightColX,
//           doc.y + 2
//         );

//         doc.moveDown(1.5);

//         /* ================= ITEMS TABLE ================= */
//         const tableTop = doc.y;
//         doc.rect(40, tableTop, 515, 20).fillColor(lightGray).fill();

//         doc.fillColor("#000").fontSize(9).font("Helvetica-Bold");
//         doc.text("SNo.", 45, tableTop + 6, { width: 30 });
//         doc.text("DESCRIPTION", 80, tableTop + 6, { width: 250 });
//         doc.text("QTY", 330, tableTop + 6, { width: 40, align: "center" });
//         doc.text("RATE", 380, tableTop + 6, { width: 80, align: "right" });
//         doc.text("AMOUNT", 470, tableTop + 6, { width: 80, align: "right" });

//         let yPosition = tableTop + 25;
//         doc.font("Helvetica").fontSize(9).fillColor("#333");

//         invoice.items.forEach((item, index) => {
//           doc.text(index + 1, 45, yPosition);
//           doc.text(item.description, 80, yPosition, { width: 250 });
//           doc.text(item.quantity.toString(), 330, yPosition, {
//             width: 40,
//             align: "center",
//           });
//           doc.text(
//             `${parseFloat(item.unit_price).toFixed(2)}`,
//             380,
//             yPosition,
//             { width: 80, align: "right" }
//           );
//           doc
//             .font("Helvetica-Bold")
//             .text(
//               `${parseFloat(item.total_price).toFixed(2)}`,
//               470,
//               yPosition,
//               { width: 80, align: "right" }
//             );

//           doc.font("Helvetica");
//           yPosition += 18;
//           doc
//             .moveTo(40, yPosition - 2)
//             .lineTo(555, yPosition - 2)
//             .lineWidth(0.5)
//             .strokeColor("#eee")
//             .stroke();
//         });

//         /* ================= CALCULATIONS & TOTALS ================= */
//         const totalX = 350;
//         let calcY = yPosition + 10;

//         const addTotalLine = (label, value, bold = false) => {
//           if (bold) doc.font("Helvetica-Bold").fillColor("#000");
//           else doc.font("Helvetica").fillColor(grayColor);
//           doc.text(label, totalX, calcY);
//           doc.text(value, totalX + 120, calcY, { width: 80, align: "right" });
//           calcY += 15;
//         };

//         addTotalLine("Subtotal:", `${parseFloat(invoice.subtotal).toFixed(2)}`);
//         addTotalLine(
//           `CGST (${invoice.cgst_rate}%):`,
//           `${parseFloat(invoice.cgst_amount).toFixed(2)}`
//         );
//         addTotalLine(
//           `SGST (${invoice.sgst_rate}%):`,
//           `${parseFloat(invoice.sgst_amount).toFixed(2)}`
//         );

//         doc
//           .rect(totalX - 5, calcY - 2, 210, 18)
//           .fillColor(lightGray)
//           .fill();
//         addTotalLine(
//           "GRAND TOTAL:",
//           `Rs ${parseFloat(invoice.grand_total).toFixed(2)}`,
//           true
//         );

//         /* ================= FOOTER ================= */
//         const footerStartY = 640;

//         doc
//           .fontSize(8)
//           .font("Helvetica-Bold")
//           .fillColor("#000")
//           .text("Terms & Conditions:", 40, footerStartY);
//         doc.font("Helvetica").fontSize(7).fillColor(grayColor);
//         doc.text("1. Goods once sold will not be taken back.", 40, doc.y + 2);
//         doc.text(
//           "2. Interest @18% p.a. will be charged if the payment is not made within the stipulated time.",
//           40,
//           doc.y + 2
//         );
//         doc.text(
//           "3. Subject to 'Madhya Pradesh' Jurisdiction only.",
//           40,
//           doc.y + 2
//         );

//         doc
//           .fontSize(9)
//           .font("Helvetica-Bold")
//           .fillColor("#000")
//           .text("Receiver's Signature", 400, footerStartY);
//         doc.text(
//           `For ${settings.general?.name || "Vrindavan Hotel"}`,
//           400,
//           footerStartY + 45
//         );
//         doc.font("Helvetica").text("Authorised Signatory", 400, doc.y + 2);

//         doc.moveDown(3);
//         doc
//           .font("Helvetica-Bold")
//           .fillColor(primaryColor)
//           .fontSize(10)
//           .text(
//             `Thank you for choosing ${
//               settings.general?.name || "Vrindavan Hotel"
//             }!`,
//             40,
//             doc.y,
//             { align: "center" }
//           );
//         doc
//           .font("Helvetica")
//           .fontSize(8)
//           .fillColor(grayColor)
//           .text(
//             "We hope you enjoyed your stay and look forward to welcoming you again",
//             { align: "center" }
//           );
//         doc
//           .fontSize(7)
//           .fillColor("#999")
//           .text(
//             "This is a computer-generated invoice and does not require a signature",
//             { align: "center" }
//           );

//         doc.end();
//         stream.on("finish", () => resolve({ filepath, filename }));
//         stream.on("error", (error) => reject(error));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }

// module.exports = PDFService;
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class PDFService {
  static async generateInvoicePDF(invoice, settings = {}) {
    console.log("Generating invoice PDF...", invoice);
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: "A4" });

        const invoiceDir = path.join(__dirname, "../../invoices");
        if (!fs.existsSync(invoiceDir)) {
          fs.mkdirSync(invoiceDir, { recursive: true });
        }

        const filename = `${invoice.invoice_number}.pdf`;
        const filepath = path.join(invoiceDir, filename);

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Helper for Dates with AM/PM Time
        const formatDate = (date) =>
          date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

        const formatDateTime = (date) =>
          date
            ? new Date(date).toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A";
        // Colors
        const primaryColor = "#1e3a8a";
        const grayColor = "#444444";
        const lightGray = "#f3f4f6";

        /* ================= LOGO & HEADER ================= */
        const logoPath = path.join(__dirname, "../../public/HMS_Logo.png");
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 40, 40, { width: 60 });
        }

        doc
          .fillColor(primaryColor)
          .fontSize(20)
          .font("Helvetica-Bold")
          .text(settings.general?.name || "VRINDAVAN PALACE", 110, 40, {
            align: "left",
          });

        doc.fillColor(grayColor).fontSize(9).font("Helvetica");
        doc.text(
          settings.general?.address || "123 Main Street, City",
          110,
          doc.y
        );
        doc.text(
          `Phone: ${settings.general?.phone || "+91-9876543210"} | Email: ${
            settings.general?.email || ""
          }`,
          110,
          doc.y
        );

        doc
          .font("Helvetica-Bold")
          .text(
            `GST No: ${settings.general?.gst_number || "29ABCDE1234F1Z5"}`,
            110,
            doc.y
          );
        doc.text(
          `UIN No: ${
            invoice.booking?.uin_number || invoice.uin_number || "N/A"
          }`,
          110,
          doc.y
        );

        doc.moveDown(1);
        doc
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .lineWidth(1)
          .strokeColor(primaryColor)
          .stroke();
        doc.moveDown(0.5);

        /* ================= INVOICE DETAILS ================= */
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("TAX INVOICE", { align: "center" });
        doc.moveDown(0.5);

        doc
          .fillColor("#000")
          .fontSize(9)
          .font("Helvetica-Bold")
          .text("INVOICE DETAILS", 40);
        doc.font("Helvetica").fillColor(grayColor);
        doc.text(`Date: ${formatDate(invoice.created_at)}`);
        doc.text(`Invoice No: ${invoice.invoice_number}`);
        if (invoice.booking_number)
          doc.text(`Booking No: ${invoice.booking_number}`);

        doc.moveDown(1);

        /* ================= GUEST & STAY DETAILS ================= */
        const detailsY = doc.y;

        doc
          .fillColor("#000")
          .font("Helvetica-Bold")
          .text("GUEST DETAILS", 40, detailsY);
        doc.font("Helvetica").fillColor(grayColor);
        doc.text(`Name: ${invoice.customer_name}`, 40, doc.y + 2);
        doc.text(`Phone: ${invoice.customer_phone || "N/A"}`, 40, doc.y + 2);
        doc.text(`Email: ${invoice.customer_email || "N/A"}`, 40, doc.y + 2);

        const rightColX = 320;
        doc
          .fillColor("#000")
          .font("Helvetica-Bold")
          .text("STAY DETAILS", rightColX, detailsY);
        doc.font("Helvetica").fillColor(grayColor);
        // Added AM/PM Time here
        doc.text(
          `Check-In: ${formatDateTime(invoice.booking?.check_in_date)}`,
          rightColX,
          doc.y + 2
        );
        doc.text(
          `Check-Out: ${formatDateTime(invoice.booking?.check_out_date)}`,
          rightColX,
          doc.y + 2
        );
        doc.text(
          `Room: ${invoice.booking?.room_number || invoice.room_no || "-"} (${
            invoice.booking?.room_type || invoice.room_type || "-"
          })`,
          rightColX,
          doc.y + 2
        );
        doc.text(
          `No. of Persons: ${
            invoice.booking?.number_of_guests || invoice.no_of_person || "-"
          }`,
          rightColX,
          doc.y + 2
        );

        doc.moveDown(2); // Added more space above table

        /* ================= ITEMS TABLE ================= */
        const tableTop = doc.y;
        doc.rect(40, tableTop, 515, 20).fillColor(lightGray).fill();

        doc.fillColor("#000").fontSize(9).font("Helvetica-Bold");
        doc.text("SNo.", 45, tableTop + 6, { width: 30 });
        doc.text("DESCRIPTION", 80, tableTop + 6, { width: 250 });
        doc.text("QTY", 330, tableTop + 6, { width: 40, align: "center" });
        doc.text("RATE", 380, tableTop + 6, { width: 80, align: "right" });
        doc.text("AMOUNT", 470, tableTop + 6, { width: 80, align: "right" });

        let yPosition = tableTop + 25;
        doc.font("Helvetica").fontSize(9).fillColor("#333");

        invoice.items.forEach((item, index) => {
          doc.text(index + 1, 45, yPosition);
          doc.text(item.description, 80, yPosition, { width: 250 });
          doc.text(item.quantity.toString(), 330, yPosition, {
            width: 40,
            align: "center",
          });
          doc.text(
            `${parseFloat(item.unit_price).toFixed(2)}`,
            380,
            yPosition,
            { width: 80, align: "right" }
          );
          doc
            .font("Helvetica-Bold")
            .text(
              `${parseFloat(item.total_price).toFixed(2)}`,
              470,
              yPosition,
              { width: 80, align: "right" }
            );

          doc.font("Helvetica");
          yPosition += 18;
          doc
            .moveTo(40, yPosition - 2)
            .lineTo(555, yPosition - 2)
            .lineWidth(0.5)
            .strokeColor("#eee")
            .stroke();
        });

        /* ================= CALCULATIONS & TOTALS ================= */
        const totalX = 350;
        let calcY = yPosition + 25; // Added extra space above subtotal

        const addTotalLine = (label, value, bold = false) => {
          if (bold) doc.font("Helvetica-Bold").fillColor("#000");
          else doc.font("Helvetica").fillColor(grayColor);
          doc.text(label, totalX, calcY);
          doc.text(value, totalX + 120, calcY, { width: 80, align: "right" });
          calcY += 15;
        };

        addTotalLine("Subtotal:", `${parseFloat(invoice.subtotal).toFixed(2)}`);
        addTotalLine(
          `CGST (${invoice.cgst_rate}%):`,
          `${parseFloat(invoice.cgst_amount).toFixed(2)}`
        );
        addTotalLine(
          `SGST (${invoice.sgst_rate}%):`,
          `${parseFloat(invoice.sgst_amount).toFixed(2)}`
        );

        // Added Total GST % and Amount Row
        const combinedGstRate = (
          parseFloat(invoice.cgst_rate) + parseFloat(invoice.sgst_rate)
        ).toFixed(2);
        const totalGstAmt = (
          parseFloat(invoice.cgst_amount) + parseFloat(invoice.sgst_amount)
        ).toFixed(2);
        addTotalLine(`Total GST (${combinedGstRate}%):`, `${totalGstAmt}`);

        doc.moveDown(0.5);
        calcY += 5;

        doc
          .rect(totalX - 5, calcY - 2, 210, 18)
          .fillColor(lightGray)
          .fill();
        addTotalLine(
          "GRAND TOTAL:",
          `Rs ${parseFloat(invoice.grand_total).toFixed(2)}`,
          true
        );

        /* ================= FOOTER ================= */
        const footerStartY = 640;
        doc
          .fontSize(8)
          .font("Helvetica-Bold")
          .fillColor("#000")
          .text("Terms & Conditions:", 40, footerStartY);
        doc.font("Helvetica").fontSize(7).fillColor(grayColor);
        doc.text("1. Goods once sold will not be taken back.", 40, doc.y + 2);
        doc.text(
          "2. Interest @18% p.a. will be charged if the payment is not made within the stipulated time.",
          40,
          doc.y + 2
        );
        doc.text(
          "3. Subject to 'Madhya Pradesh' Jurisdiction only.",
          40,
          doc.y + 2
        );

        doc
          .fontSize(9)
          .font("Helvetica-Bold")
          .fillColor("#000")
          .text("Receiver's Signature", 400, footerStartY);
        doc.text(
          `For ${settings.general?.name || "Vrindavan Hotel"}`,
          400,
          footerStartY + 45
        );
        doc.font("Helvetica").text("Authorised Signatory", 400, doc.y + 2);

        doc.moveDown(3);
        doc
          .font("Helvetica-Bold")
          .fillColor(primaryColor)
          .fontSize(10)
          .text(
            `Thank you for choosing ${
              settings.general?.name || "Vrindavan Hotel"
            }!`,
            40,
            doc.y,
            { align: "center" }
          );
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(grayColor)
          .text(
            "We hope you enjoyed your stay and look forward to welcoming you again",
            { align: "center" }
          );
        doc
          .fontSize(7)
          .fillColor("#999")
          .text(
            "This is a computer-generated invoice and does not require a signature",
            { align: "center" }
          );

        doc.end();
        stream.on("finish", () => resolve({ filepath, filename }));
        stream.on("error", (error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFService;
