import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { roomsAPI } from "@/api/rooms";
import { bookingsAPI } from "@/api/bookings";
import { customersAPI } from "@/api/customers";
import { invoicesAPI } from "@/api/invoices";
import { paymentsAPI } from "@/api/payments";
import {
  BedDouble,
  Users,
  Calendar,
  IndianRupee,
  TrendingUp,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  FileText,
  Target,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCheckIn, useCheckOut } from "@/hooks/useBookings";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  // Fetch all data
  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomsAPI.getAll(),
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", { limit: 1 }],
    queryFn: () => customersAPI.getAll({ limit: 1 }),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings", { limit: 10 }],
    queryFn: () => bookingsAPI.getAll({ limit: 10 }),
  });

  const { data: arrivalsData, isLoading: arrivalsLoading } = useQuery({
    queryKey: ["bookings", "today", "arrivals"],
    queryFn: bookingsAPI.getTodayArrivals,
    refetchInterval: 60000,
  });

  const { data: departuresData, isLoading: departuresLoading } = useQuery({
    queryKey: ["bookings", "today", "departures"],
    queryFn: bookingsAPI.getTodayDepartures,
    refetchInterval: 60000,
  });

  const { data: invoiceStatsData, isLoading: invoiceStatsLoading } = useQuery({
    queryKey: ["invoice-stats"],
    queryFn: invoicesAPI.getStats,
  });

  const { data: paymentSummaryData, isLoading: paymentSummaryLoading } =
    useQuery({
      queryKey: ["payment-summary-today"],
      queryFn: paymentsAPI.getTodaysSummary,
      refetchInterval: 60000,
    });

  // Check if any critical data is loading
  const isLoading = roomsLoading || customersLoading;

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout
        title="Manager Dashboard"
        subtitle="Operations overview and performance metrics."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              Loading manager dashboard...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Extract data
  const rooms = roomsData?.data?.rooms || [];
  const totalCustomers = customersData?.data?.pagination?.total || 0;
  const recentBookings = bookingsData?.data?.bookings || [];
  const todayArrivals = arrivalsData?.data?.arrivals || [];
  const todayDepartures = departuresData?.data?.departures || [];
  const invoiceStats = invoiceStatsData?.data || {};
  const paymentSummary = paymentSummaryData?.data || {};

  // Calculate stats
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const maintenanceRooms = rooms.filter(
    (r) => r.status === "maintenance",
  ).length;
  const occupancyRate =
    rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

  const totalRevenue = invoiceStats.total_amount || 0;
  const avgBookingValue =
    recentBookings.length > 0
      ? recentBookings.reduce((sum, b) => sum + Number(b.total_amount), 0) /
        recentBookings.length
      : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    checked_in: "bg-green-100 text-green-700",
    checked_out: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const handleCheckIn = async (bookingId) => {
    try {
      await checkInMutation.mutateAsync(bookingId);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleCheckOut = async (bookingId) => {
    try {
      await checkOutMutation.mutateAsync(bookingId);
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <MainLayout
      title="Manager Dashboard"
      subtitle="Operations overview and performance metrics."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Manager Stats Grid - Focus on operations and revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            subtitle={`${occupiedRooms} occupied, ${maintenanceRooms} maintenance`}
            icon={BedDouble}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Available Rooms"
            value={availableRooms}
            subtitle="Ready for check-in"
            icon={Calendar}
          />
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            subtitle="Registered guests"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Last 30 days performance"
            icon={DollarSign}
            variant="gold"
          />
        </div>

        {/* Today's Operations Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check-ins */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Today's Check-ins
              </CardTitle>
              <Badge variant="secondary">
                {arrivalsLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  todayArrivals.length
                )}
              </Badge>
            </CardHeader>
            <CardContent>
              {arrivalsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : todayArrivals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No check-ins scheduled for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todayArrivals.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.room_number} •{" "}
                          {booking.number_of_guests} guests •{" "}
                          {formatCurrency(booking.total_amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[booking.status]}>
                          {booking.status.replace("_", " ")}
                        </Badge>
                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={checkInMutation.isPending}
                          >
                            {checkInMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <LogIn className="h-3 w-3 mr-1" />
                                Check In
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check-outs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Today's Check-outs
              </CardTitle>
              <Badge variant="secondary">
                {departuresLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  todayDepartures.length
                )}
              </Badge>
            </CardHeader>
            <CardContent>
              {departuresLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : todayDepartures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No check-outs scheduled for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todayDepartures.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.room_number} •{" "}
                          {formatCurrency(booking.total_amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-700">
                          Due Today
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckOut(booking.id)}
                          disabled={checkOutMutation.isPending}
                        >
                          {checkOutMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <LogOut className="h-3 w-3 mr-1" />
                              Check Out
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Performance */}
          {!paymentSummaryLoading && paymentSummary.total_transactions > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Today's Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transactions
                    </p>
                    <p className="text-2xl font-bold">
                      {paymentSummary.total_transactions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(paymentSummary.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Payment Methods
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {paymentSummary.by_method?.map((method) => (
                        <Badge
                          key={method.payment_method}
                          variant="outline"
                          className="text-xs"
                        >
                          {method.payment_method.replace("_", " ")}:{" "}
                          {method.method_count}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Booking Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Booking Value
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(avgBookingValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recent Bookings
                  </p>
                  <p className="text-2xl font-bold">{recentBookings.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Occupancy Trend
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">+12%</Badge>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-purple-600" />
                Room Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Occupied
                  </span>
                  <Badge variant="default">{occupiedRooms}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Available
                  </span>
                  <Badge variant="secondary">{availableRooms}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Maintenance
                  </span>
                  <Badge variant="outline">{maintenanceRooms}</Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Rooms</span>
                    <span className="font-bold">{rooms.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings & Invoice Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/bookings")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bookings yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate("/bookings/new")}
                  >
                    Create First Booking
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {booking.room_number} •
                            {booking.check_in_date &&
                              booking.check_out_date && (
                                <>
                                  {" "}
                                  {format(
                                    new Date(booking.check_in_date),
                                    "MMM d",
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(booking.check_out_date),
                                    "MMM d, yyyy",
                                  )}
                                </>
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={statusColors[booking.status]}>
                          {booking.status.replace("_", " ")}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(booking.total_amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          {!invoiceStatsLoading && invoiceStats.total_invoices > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Invoice Summary (30 Days)
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/invoices")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Invoices
                    </p>
                    <p className="text-2xl font-bold">
                      {invoiceStats.total_invoices}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-2xl font-bold text-green-600">
                      {invoiceStats.paid_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {invoiceStats.pending_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Due</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(invoiceStats.total_due)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
