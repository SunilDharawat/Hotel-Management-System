import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { bookingsAPI } from "@/api/bookings";
import { useCheckIn } from "@/hooks/useBookings";
import { CheckoutModal } from "@/components/booking/CheckoutModal";
import { CancellationModal } from "@/components/booking/CancellationModal";
import { ExtendStayModal } from "@/components/booking/ExtendStayModal";
import {
  Search,
  Plus,
  Calendar,
  LogIn,
  LogOut,
  Clock,
  XCircle,
  CalendarPlus,
  Loader2,
  User,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  checked_in: "bg-green-100 text-green-700 border-green-200",
  checked_out: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function Bookings() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);

  // Fetch bookings from API
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "bookings",
      {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      bookingsAPI.getAll({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery || undefined,
      }),
  });

  const checkInMutation = useCheckIn();
  const bookings = data?.data?.bookings || [];

  // Filter Logic (keeping your existing logic)
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.room_number?.includes(searchQuery) ||
      booking.booking_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCheckIn = async (booking) => {
    try {
      await checkInMutation.mutateAsync(booking.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckOut = (booking) => {
    setCheckoutBooking(booking);
  };

  const handleCancel = (booking) => {
    setCancelBooking(booking);
  };

  const handleExtend = (booking) => {
    setExtendBooking(booking);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <MainLayout title="Bookings" subtitle="Manage reservations and check-ins">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Bookings" subtitle="Manage reservations and check-ins">
        <div className="text-center py-12 text-red-600">
          <p>Error loading bookings: {error.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Bookings" subtitle="Manage reservations and check-ins">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-64 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            className="hotel-button-gold shadow-sm"
            onClick={() => navigate("/bookings/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap bg-muted/50 p-1 rounded-lg w-fit">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            onClick={() => setStatusFilter("all")}
            size="sm"
          >
            All
          </Button>
          {[
            "pending",
            "confirmed",
            "checked_in",
            "checked_out",
            "cancelled",
          ].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "ghost"}
              onClick={() => setStatusFilter(status)}
              size="sm"
              className="capitalize"
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>

        {/* Bookings List (Cards) */}
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="overflow-hidden hover:shadow-md transition-all"
            >
              <CardContent className="p-0">
                <div className="p-6 flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left Section: Guest Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-xl tracking-tight">
                        {booking.customer_name || "Unknown Guest"}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`${
                          statusColors[booking.status]
                        } border font-semibold`}
                      >
                        {booking.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono bg-slate-100 px-2 py-1 rounded">
                        #{booking.booking_number}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-foreground font-medium">
                          {format(new Date(booking.check_in_date), "MMM d")} -{" "}
                          {format(
                            new Date(booking.check_out_date),
                            "MMM d, yyyy",
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                          ROOM {booking.room_number || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {booking.number_of_guests} guest(s)
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {booking.room_rate}\per night
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="bg-amber-50 text-amber-800 text-xs p-2 rounded-md border border-amber-100 italic">
                        "{booking.special_requests}"
                      </div>
                    )}
                  </div>

                  {/* Right Section: Payment Info */}
                  <div className="lg:text-right flex flex-col justify-center lg:border-l lg:pl-6 min-w-[180px]">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                      Total Room Rent
                    </p>
                    <p className="text-2xl font-black text-slate-900 leading-none mb-2">
                      {formatCurrency(booking.total_amount)}
                    </p>
                    <div className="flex items-center lg:justify-end gap-1.5 text-sm font-medium text-green-600">
                      <CreditCard className="h-4 w-4" />
                      Advance : {formatCurrency(booking.advance_payment || 0)}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar: All your dropdown functions moved here */}
                <div className="bg-slate-50/80 px-6 py-3 border-t flex flex-wrap items-center gap-2 justify-end">
                  {booking.status === "confirmed" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 h-9  w-full md:w-auto"
                      onClick={() => handleCheckIn(booking)}
                      disabled={checkInMutation.isPending}
                    >
                      {checkInMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <LogIn className="h-4 w-4 mr-2" />
                      )}
                      Check In
                    </Button>
                  )}

                  {booking.status === "checked_in" && (
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 h-9 w-full md:w-auto"
                      onClick={() => handleCheckOut(booking)}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Check Out
                    </Button>
                  )}

                  {["confirmed", "checked_in"].includes(booking.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExtend(booking)}
                      className="h-9 w-full md:w-auto"
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" /> Extend Stay
                    </Button>
                  )}

                  {["pending", "confirmed"].includes(booking.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-400 h-9 w-full md:w-auto"
                      onClick={() => handleCancel(booking)}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  )}

                  {booking.status === "checked_in" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 hover:bg-orange-50 h-9 w-full md:w-auto"
                      onClick={() => handleCancel(booking)}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Early Checkout
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                    className="h-9 ml-auto lg:ml-0 w-full md:w-auto"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Components - Functions mapped to props as per your logic */}
      {checkoutBooking && (
        <CheckoutModal
          isOpen={!!checkoutBooking}
          onClose={() => setCheckoutBooking(null)}
          booking={checkoutBooking}
        />
      )}

      {cancelBooking && (
        <CancellationModal
          isOpen={!!cancelBooking}
          onClose={() => setCancelBooking(null)}
          booking={cancelBooking}
        />
      )}

      {extendBooking && (
        <ExtendStayModal
          isOpen={!!extendBooking}
          onClose={() => setExtendBooking(null)}
          booking={extendBooking}
        />
      )}
    </MainLayout>
  );
}
