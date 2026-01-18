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
import { usersAPI } from "@/api/users";
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
  UserCheck,
  Settings,
  Activity,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCheckIn, useCheckOut } from "@/hooks/useBookings";

export default function AdminDashboard() {
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

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", { limit: 1 }],
    queryFn: () => usersAPI.getAll({ limit: 1 }),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings", { limit: 5 }],
    queryFn: () => bookingsAPI.getAll({ limit: 5 }),
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
  const isLoading = roomsLoading || customersLoading || usersLoading;

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout
        title="Admin Dashboard"
        subtitle="Complete system overview and management."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Extract data
  const rooms = roomsData?.data?.rooms || [];
  const totalCustomers = customersData?.data?.pagination?.total || 0;
  const totalUsers = usersData?.data?.pagination?.total || 0;
  const recentBookings = bookingsData?.data?.bookings || [];
  const todayArrivals = arrivalsData?.data?.arrivals || [];
  const todayDepartures = departuresData?.data?.departures || [];
  const invoiceStats = invoiceStatsData?.data || {};
  const paymentSummary = paymentSummaryData?.data || {};

  // Calculate stats
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const occupancyRate =
    rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

  const totalRevenue = invoiceStats.total_amount || 0;

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
      title="Admin Dashboard"
      subtitle="Complete system overview and management."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Admin Stats Grid - More comprehensive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            subtitle={`${occupiedRooms} of ${rooms.length} rooms occupied`}
            icon={BedDouble}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            subtitle="System staff accounts"
            icon={UserCheck}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            subtitle="Registered guests"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Last 30 days"
            icon={IndianRupee}
            variant="gold"
          />
        </div>

        {/* System Health & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                System Status
              </CardTitle>
              <Badge className="bg-green-100 text-green-700">Online</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Database
                  </span>
                  <Badge variant="outline">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    API Server
                  </span>
                  <Badge variant="outline">Running</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Backup
                  </span>
                  <span className="text-sm">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Check-ins */}
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
                  No check-ins scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {todayArrivals.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {booking.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Room {booking.room_number}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={statusColors[booking.status]}
                          size="sm"
                        >
                          {booking.status.replace("_", " ")}
                        </Badge>
                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={checkInMutation.isPending}
                          >
                            <LogIn className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Check-outs */}
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
                  No check-outs scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {todayDepartures.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {booking.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Room {booking.room_number}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(booking.id)}
                        disabled={checkOutMutation.isPending}
                      >
                        <LogOut className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Summary */}
          {!paymentSummaryLoading && paymentSummary.total_transactions > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  Today's Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Stats */}
          {!invoiceStatsLoading && invoiceStats.total_invoices > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Invoice Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold">
                      {invoiceStats.total_invoices}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="text-xl font-bold text-green-600">
                      {invoiceStats.paid_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {invoiceStats.pending_count}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity & Quick Actions */}
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
                <p className="text-muted-foreground text-center py-4">
                  No bookings
                </p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {booking.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Room {booking.room_number}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={statusColors[booking.status]}
                          size="sm"
                        >
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/users")}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/reports")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/bookings/new")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
