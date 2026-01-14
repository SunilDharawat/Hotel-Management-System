// import { MainLayout } from "@/components/layout/MainLayout";
// import { StatCard } from "@/components/dashboard/StatCard";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   useRooms,
//   useBookings,
//   useCustomers,
//   useInvoices,
// } from "@/contexts/App";
// import {
//   BedDouble,
//   Users,
//   Calendar,
//   IndianRupee,
//   TrendingUp,
//   Clock,
// } from "lucide-react";
// import { format } from "date-fns";

// export default function Dashboard() {
//   const { rooms } = useRooms();
//   const { bookings } = useBookings();
//   const { customers } = useCustomers();
//   const { invoices } = useInvoices();

//   const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
//   const availableRooms = rooms.filter((r) => r.status === "available").length;
//   const occupancyRate = Math.round((occupiedRooms / rooms.length) * 100);

//   const todayCheckIns = bookings.filter((b) => {
//     const checkIn = new Date(b.checkIn);
//     const today = new Date();
//     return (
//       checkIn.toDateString() === today.toDateString() &&
//       b.status !== "cancelled"
//     );
//   });

//   const todayCheckOuts = bookings.filter((b) => {
//     const checkOut = new Date(b.checkOut);
//     const today = new Date();
//     return (
//       checkOut.toDateString() === today.toDateString() &&
//       b.status === "checked_in"
//     );
//   });

//   const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

//   const recentBookings = bookings
//     .filter((b) => b.status !== "cancelled")
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//     .slice(0, 5);

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const getCustomerName = (customerId) => {
//     const customer = customers.find((c) => c.id === customerId);
//     return customer?.name || "Unknown";
//   };

//   const getRoomNumber = (roomId) => {
//     const room = rooms.find((r) => r.id === roomId);
//     return room?.roomNumber || "N/A";
//   };

//   const statusColors = {
//     pending: "bg-yellow-100 text-yellow-700",
//     confirmed: "bg-blue-100 text-blue-700",
//     checked_in: "bg-green-100 text-green-700",
//     checked_out: "bg-gray-100 text-gray-700",
//     cancelled: "bg-red-100 text-red-700",
//   };

//   return (
//     <MainLayout
//       title="Dashboard"
//       subtitle="Welcome back! Here's your hotel overview."
//     >
//       <div className="space-y-6 animate-fade-in">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Occupancy Rate"
//             value={`${occupancyRate}%`}
//             subtitle={`${occupiedRooms} of ${rooms.length} rooms occupied`}
//             icon={BedDouble}
//             trend={{ value: 12, isPositive: true }}
//             variant="primary"
//           />
//           <StatCard
//             title="Available Rooms"
//             value={availableRooms}
//             subtitle="Ready for booking"
//             icon={Calendar}
//           />
//           <StatCard
//             title="Total Guests"
//             value={customers.length}
//             subtitle="Registered customers"
//             icon={Users}
//             trend={{ value: 8, isPositive: true }}
//           />
//           <StatCard
//             title="Revenue"
//             value={formatCurrency(totalRevenue)}
//             subtitle="Total collections"
//             icon={IndianRupee}
//             variant="gold"
//           />
//         </div>

//         {/* Today's Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-green-600" />
//                 Today's Check-ins
//               </CardTitle>
//               <Badge variant="secondary">{todayCheckIns.length}</Badge>
//             </CardHeader>
//             <CardContent>
//               {todayCheckIns.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   No check-ins scheduled for today
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {todayCheckIns.map((booking) => (
//                     <div
//                       key={booking.id}
//                       className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
//                     >
//                       <div>
//                         <p className="font-medium">
//                           {getCustomerName(booking.customerId)}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           Room {getRoomNumber(booking.roomId)}
//                         </p>
//                       </div>
//                       <Badge className={statusColors[booking.status]}>
//                         {booking.status.replace("_", " ")}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-orange-600" />
//                 Today's Check-outs
//               </CardTitle>
//               <Badge variant="secondary">{todayCheckOuts.length}</Badge>
//             </CardHeader>
//             <CardContent>
//               {todayCheckOuts.length === 0 ? (
//                 <p className="text-sm text-muted-foreground">
//                   No check-outs scheduled for today
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {todayCheckOuts.map((booking) => (
//                     <div
//                       key={booking.id}
//                       className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
//                     >
//                       <div>
//                         <p className="font-medium">
//                           {getCustomerName(booking.customerId)}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           Room {getRoomNumber(booking.roomId)}
//                         </p>
//                       </div>
//                       <Badge className="bg-orange-100 text-orange-700">
//                         Due Today
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Recent Bookings */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Bookings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentBookings.map((booking) => (
//                 <div
//                   key={booking.id}
//                   className="flex items-center justify-between p-4 rounded-lg border"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Users className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium">
//                         {getCustomerName(booking.customerId)}
//                       </p>
//                       {/* <p className="text-sm text-muted-foreground">
//                         Room {getRoomNumber(booking.roomId)} • {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
//                       </p> */}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <Badge className={statusColors[booking.status]}>
//                       {booking.status.replace("_", " ")}
//                     </Badge>
//                     <p className="text-sm font-medium mt-1">
//                       {formatCurrency(booking.totalAmount)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   );
// }

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
  AlertCircle,
  LogIn,
  LogOut,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCheckIn, useCheckOut } from "@/hooks/useBookings";
import { toast } from "sonner";

export default function Dashboard() {
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
    queryKey: ["bookings", { limit: 5 }],
    queryFn: () => bookingsAPI.getAll({ limit: 5 }),
  });

  const { data: arrivalsData, isLoading: arrivalsLoading } = useQuery({
    queryKey: ["bookings", "today", "arrivals"],
    queryFn: bookingsAPI.getTodayArrivals,
    refetchInterval: 60000, // Refetch every minute
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
  const isLoading = roomsLoading || customersLoading || bookingsLoading;

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout
        title="Dashboard"
        subtitle="Welcome back! Here's your hotel overview."
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
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
  const todayDepartures = arrivalsData?.data?.departures || [];
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
            value={totalCustomers}
            subtitle="Registered customers"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Revenue (30 Days)"
            value={formatCurrency(totalRevenue)}
            subtitle="Total collections"
            icon={IndianRupee}
            variant="gold"
          />
        </div>

        {/* Today's Activity */}
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
                          {booking.number_of_guests} guests
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
                          Room {booking.room_number}
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

        {/* Payment Summary */}
        {!paymentSummaryLoading && paymentSummary.total_transactions > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-green-600" />
                Today's Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold">
                    {paymentSummary.total_transactions}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(paymentSummary.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Payment Methods
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {paymentSummary.by_method?.map((method) => (
                      <Badge key={method.payment_method} variant="outline">
                        {method.payment_method}: {method.method_count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.room_number} •
                          {booking.check_in_date && booking.check_out_date && (
                            <>
                              {" "}
                              {format(
                                new Date(booking.check_in_date),
                                "MMM d"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(booking.check_out_date),
                                "MMM d, yyyy"
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

        {/* Invoice Stats */}
        {!invoiceStatsLoading && invoiceStats.total_invoices > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Statistics (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
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
    </MainLayout>
  );
}
