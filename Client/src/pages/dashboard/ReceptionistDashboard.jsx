import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { roomsAPI } from "@/api/rooms";
import { bookingsAPI } from "@/api/bookings";
import { customersAPI } from "@/api/customers";
import {
  BedDouble,
  Users,
  Calendar,
  Phone,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  CheckCircle,
  Plus,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCheckIn, useCheckOut } from "@/hooks/useBookings";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  // Fetch essential data for receptionist tasks
  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomsAPI.getAll(),
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", { limit: 5 }],
    queryFn: () => customersAPI.getAll({ limit: 5 }),
  });

  const { data: arrivalsData, isLoading: arrivalsLoading } = useQuery({
    queryKey: ["bookings", "today", "arrivals"],
    queryFn: bookingsAPI.getTodayArrivals,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  const { data: departuresData, isLoading: departuresLoading } = useQuery({
    queryKey: ["bookings", "today", "departures"],
    queryFn: bookingsAPI.getTodayDepartures,
    refetchInterval: 30000,
  });

  const { data: activeBookingsData, isLoading: activeBookingsLoading } =
    useQuery({
      queryKey: ["bookings", "active"],
      queryFn: () => bookingsAPI.getActive(),
      refetchInterval: 60000,
    });

  // Check if any critical data is loading
  const isLoading = roomsLoading || customersLoading;

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout
        title="Receptionist Dashboard"
        subtitle="Front desk operations and guest services."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              Loading reception dashboard...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Extract data
  const rooms = roomsData?.data?.rooms || [];
  const recentCustomers = customersData?.data?.customers || [];
  const todayArrivals = arrivalsData?.data?.arrivals || [];
  const todayDepartures = departuresData?.data?.departures || [];
  const activeBookings = activeBookingsData?.data?.bookings || [];

  // Calculate stats
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const occupancyRate =
    rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout
      title="Receptionist Dashboard"
      subtitle="Front desk operations and guest services."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Receptionist Stats Grid - Focus on immediate tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Available Rooms"
            value={availableRooms}
            subtitle="Ready for check-in"
            icon={BedDouble}
            variant="primary"
          />
          <StatCard
            title="Today's Arrivals"
            value={arrivalsLoading ? "..." : todayArrivals.length}
            subtitle="Guests checking in today"
            icon={LogIn}
            trend={{
              value: todayArrivals.filter((a) => a.status === "confirmed")
                .length,
              isPositive: true,
            }}
          />
          <StatCard
            title="Today's Departures"
            value={departuresLoading ? "..." : todayDepartures.length}
            subtitle="Guests checking out today"
            icon={LogOut}
          />
          <StatCard
            title="Occupied Rooms"
            value={occupiedRooms}
            subtitle={`${occupancyRate}% occupancy rate`}
            icon={Users}
          />
        </div>

        {/* Priority Actions - Check-ins and Check-outs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Check-ins - Priority */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5 text-green-600" />
                Today's Check-ins
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {arrivalsLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    todayArrivals.length
                  )}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/bookings/new")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Booking
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {arrivalsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : todayArrivals.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No check-ins scheduled for today
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate("/bookings/new")}
                  >
                    Create New Booking
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayArrivals.map((booking) => (
                    <div
                      key={booking.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        booking.status === "confirmed"
                          ? "border-green-200 bg-green-50 hover:bg-green-100"
                          : "border-gray-200 bg-muted/50"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{booking.customer_name}</p>
                          {booking.status === "confirmed" && (
                            <Badge className="bg-green-100 text-green-700 animate-pulse">
                              Ready for Check-in
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Room {booking.room_number}</span>
                          <span>•</span>
                          <span>{booking.number_of_guests} guests</span>
                          <span>•</span>
                          <span>{formatCurrency(booking.total_amount)}</span>
                        </div>
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
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {checkInMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
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

          {/* Today's Check-outs - Priority */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5 text-orange-600" />
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
                <p className="text-sm text-muted-foreground text-center py-8">
                  No check-outs scheduled for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todayDepartures.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{booking.customer_name}</p>
                          <Badge className="bg-orange-100 text-orange-700">
                            Due Today
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Room {booking.room_number}</span>
                          <span>•</span>
                          <span>{formatCurrency(booking.total_amount)}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(booking.id)}
                        disabled={checkOutMutation.isPending}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Guests and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Guests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Current Guests
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/bookings")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {activeBookingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : activeBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No current guests
                </p>
              ) : (
                <div className="space-y-3">
                  {activeBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.room_number} • Since{" "}
                          {format(new Date(booking.check_in_date), "MMM d")}
                        </p>
                      </div>
                      <Badge className={statusColors[booking.status]}>
                        {booking.status.replace("_", " ")}
                      </Badge>
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
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button
                  className="justify-start h-12"
                  onClick={() => navigate("/bookings/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Booking
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => navigate("/customers/new")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add New Customer
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => navigate("/rooms")}
                >
                  <BedDouble className="h-4 w-4 mr-2" />
                  View Room Status
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12"
                  onClick={() => navigate("/bookings")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Recent Customers
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/customers")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No customers yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate("/customers/new")}
                >
                  Add First Customer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.full_name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.contact_number}
                          </span>
                          <span>•</span>
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{customer.id_proof_type}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/customers`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
