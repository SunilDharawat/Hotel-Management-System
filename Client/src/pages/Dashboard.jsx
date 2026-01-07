import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useRooms,
  useBookings,
  useCustomers,
  useInvoices,
} from "@/contexts/AppContext";
import {
  BedDouble,
  Users,
  Calendar,
  IndianRupee,
  TrendingUp,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { rooms } = useRooms();
  const { bookings } = useBookings();
  const { customers } = useCustomers();
  const { invoices } = useInvoices();

  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100);

  const todayCheckIns = bookings.filter((b) => {
    const checkIn = new Date(b.checkIn);
    const today = new Date();
    return (
      checkIn.toDateString() === today.toDateString() &&
      b.status !== "cancelled"
    );
  });

  const todayCheckOuts = bookings.filter((b) => {
    const checkOut = new Date(b.checkOut);
    const today = new Date();
    return (
      checkOut.toDateString() === today.toDateString() &&
      b.status === "checked_in"
    );
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  const recentBookings = bookings
    .filter((b) => b.status !== "cancelled")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer?.name || "Unknown";
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    return room?.roomNumber || "N/A";
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    checked_in: "bg-green-100 text-green-700",
    checked_out: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your hotel overview."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
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
            title="Available Rooms"
            value={availableRooms}
            subtitle="Ready for booking"
            icon={Calendar}
          />
          <StatCard
            title="Total Guests"
            value={customers.length}
            subtitle="Registered customers"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Total collections"
            icon={IndianRupee}
            variant="gold"
          />
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Today's Check-ins
              </CardTitle>
              <Badge variant="secondary">{todayCheckIns.length}</Badge>
            </CardHeader>
            <CardContent>
              {todayCheckIns.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No check-ins scheduled for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todayCheckIns.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {getCustomerName(booking.customerId)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Room {getRoomNumber(booking.roomId)}
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Today's Check-outs
              </CardTitle>
              <Badge variant="secondary">{todayCheckOuts.length}</Badge>
            </CardHeader>
            <CardContent>
              {todayCheckOuts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No check-outs scheduled for today
                </p>
              ) : (
                <div className="space-y-3">
                  {todayCheckOuts.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {getCustomerName(booking.customerId)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Room {getRoomNumber(booking.roomId)}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">
                        Due Today
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {getCustomerName(booking.customerId)}
                      </p>
                      {/* <p className="text-sm text-muted-foreground">
                        Room {getRoomNumber(booking.roomId)} • {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                      </p> */}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={statusColors[booking.status]}>
                      {booking.status.replace("_", " ")}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
