import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { reportsAPI, downloadExcelFile } from "@/api/reports";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BedDouble,
  IndianRupee,
  Users,
  TrendingUp,
  Loader2,
  BarChart3,
  PieChart,
} from "lucide-react";
import { format, subDays } from "date-fns";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("occupancy");
  const [dateRange, setDateRange] = useState("30");
  const [roomType, setRoomType] = useState("all");

  // Calculate date range
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(
    subDays(new Date(), parseInt(dateRange)),
    "yyyy-MM-dd",
  );

  const reportParams = {
    startDate,
    endDate,
    ...(roomType !== "all" && { roomType }),
  };

  // Fetch occupancy report data
  const { data: occupancyData, isLoading: occupancyLoading } = useQuery({
    queryKey: ["reports", "occupancy", reportParams],
    queryFn: () => reportsAPI.getOccupancyReport(reportParams),
    enabled: selectedReport === "occupancy",
  });

  // Fetch revenue report data
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["reports", "revenue", reportParams],
    queryFn: () => reportsAPI.getRevenueReport(reportParams),
    enabled: selectedReport === "revenue",
  });

  // Fetch booking report data
  const { data: bookingData, isLoading: bookingLoading } = useQuery({
    queryKey: ["reports", "bookings", reportParams],
    queryFn: () => reportsAPI.getBookingReport(reportParams),
    enabled: selectedReport === "bookings",
  });

  // Fetch customer report data
  const { data: customerData, isLoading: customerLoading } = useQuery({
    queryKey: ["reports", "customers", reportParams],
    queryFn: () => reportsAPI.getCustomerReport(reportParams),
    enabled: selectedReport === "customers",
  });

  const isLoading =
    occupancyLoading || revenueLoading || bookingLoading || customerLoading;

  // Export handlers
  const handleExportOccupancy = async () => {
    try {
      const response = await reportsAPI.exportOccupancyReport(reportParams);
      const filename = `occupancy-report-${startDate}-to-${endDate}.xlsx`;
      downloadExcelFile(response, filename);
    } catch (error) {
      console.error("Error exporting occupancy report:", error);
    }
  };

  const handleExportRevenue = async () => {
    try {
      const response = await reportsAPI.exportRevenueReport(reportParams);
      const filename = `revenue-report-${startDate}-to-${endDate}.xlsx`;
      downloadExcelFile(response, filename);
    } catch (error) {
      console.error("Error exporting revenue report:", error);
    }
  };

  const renderReportContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    switch (selectedReport) {
      case "occupancy":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Rooms"
                value={occupancyData?.data?.summary?.totalRooms || 0}
                icon={BedDouble}
              />
              <StatCard
                title="Overall Occupancy Rate"
                value={`${occupancyData?.data?.summary?.overallOccupancyRate || 0}%`}
                icon={TrendingUp}
              />
              <StatCard
                title="Occupied Room Days"
                value={occupancyData?.data?.summary?.occupiedRoomDays || 0}
                icon={Calendar}
              />
              <StatCard
                title="Available Room Days"
                value={
                  (occupancyData?.data?.summary?.totalRoomDays || 0) -
                  (occupancyData?.data?.summary?.occupiedRoomDays || 0)
                }
                icon={BedDouble}
              />
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleExportOccupancy}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>

            {/* Room Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Occupancy by Room Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    occupancyData?.data?.occupancyByRoomType || {},
                  ).map(([roomType, data]) => (
                    <div
                      key={roomType}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <h4 className="font-semibold capitalize">{roomType}</h4>
                        <p className="text-sm text-gray-600">
                          {data.occupied} of {data.total} rooms occupied
                        </p>
                      </div>
                      <Badge variant="secondary">{data.occupancyRate}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "revenue":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={`₹${(revenueData?.data?.summary?.totalRevenue || 0).toFixed(2)}`}
                icon={IndianRupee}
              />
              <StatCard
                title="Net Revenue"
                value={`₹${(revenueData?.data?.summary?.netRevenue || 0).toFixed(2)}`}
                icon={TrendingUp}
              />
              <StatCard
                title="Total GST"
                value={`₹${(revenueData?.data?.summary?.totalGST || 0).toFixed(2)}`}
                icon={IndianRupee}
              />
              <StatCard
                title="Transactions"
                value={revenueData?.data?.summary?.totalTransactions || 0}
                icon={BarChart3}
              />
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleExportRevenue}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>

            {/* Payment Method Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Revenue by Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    revenueData?.data?.revenueByPaymentMethod || {},
                  ).map(([method, data]) => (
                    <div
                      key={method}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <h4 className="font-semibold capitalize">{method}</h4>
                        <p className="text-sm text-gray-600">
                          {data.count} transactions
                        </p>
                      </div>
                      <Badge variant="secondary">
                        ₹{data.amount.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Type Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue by Room Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    revenueData?.data?.revenueByRoomType || {},
                  ).map(([roomType, data]) => (
                    <div
                      key={roomType}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <h4 className="font-semibold capitalize">{roomType}</h4>
                        <p className="text-sm text-gray-600">
                          {data.bookingCount} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          ₹{data.grossRevenue.toFixed(2)}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          Net: ₹{data.netRevenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Bookings"
                value={bookingData?.data?.summary?.total || 0}
                icon={Calendar}
              />
              <StatCard
                title="Confirmed"
                value={bookingData?.data?.summary?.confirmed || 0}
                icon={Users}
              />
              <StatCard
                title="Pending"
                value={bookingData?.data?.summary?.pending || 0}
                icon={Clock}
              />
              <StatCard
                title="Cancelled"
                value={bookingData?.data?.summary?.cancelled || 0}
                icon={TrendingUp}
              />
            </div>

            {/* Booking Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Bookings by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    bookingData?.data?.bookingsByStatus || {},
                  ).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <h4 className="font-semibold capitalize">{status}</h4>
                        <p className="text-sm text-gray-600">
                          {(
                            (count / (bookingData?.data?.summary?.total || 1)) *
                            100
                          ).toFixed(1)}
                          % of total
                        </p>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Type Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Bookings by Room Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    bookingData?.data?.bookingsByRoomType || {},
                  ).map(([roomType, count]) => (
                    <div
                      key={roomType}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <h4 className="font-semibold capitalize">{roomType}</h4>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Customers"
                value={customerData?.data?.summary?.totalCustomers || 0}
                icon={Users}
              />
              <StatCard
                title="New Customers"
                value={customerData?.data?.summary?.newCustomers || 0}
                icon={TrendingUp}
              />
              <StatCard
                title="Repeat Customers"
                value={customerData?.data?.summary?.repeatCustomers || 0}
                icon={Users}
              />
              <StatCard
                title="Repeat Rate"
                value={`${customerData?.data?.summary?.repeatCustomerRate || 0}%`}
                icon={PieChart}
              />
            </div>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Customers by Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerData?.data?.topCustomers
                    ?.slice(0, 10)
                    .map((item, index) => (
                      <div
                        key={item.customer.id}
                        className="flex items-center justify-between p-4 border rounded"
                      >
                        <div>
                          <h4 className="font-semibold">
                            {item.customer.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.bookingCount} bookings
                          </p>
                        </div>
                        <Badge variant="secondary">
                          ₹{item.totalRevenue.toFixed(2)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout title="Reports" subtitle="Generate and analyze hotel reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-600">
              {format(new Date(), "MMM dd, yyyy")}
            </span>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Report Type
                </label>
                <Select
                  value={selectedReport}
                  onValueChange={setSelectedReport}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="occupancy">Occupancy Report</SelectItem>
                    <SelectItem value="revenue">Revenue Report</SelectItem>
                    <SelectItem value="bookings">Booking Report</SelectItem>
                    <SelectItem value="customers">Customer Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedReport === "occupancy" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Room Type
                  </label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  <p>
                    Period: {startDate} to {endDate}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </MainLayout>
  );
}
