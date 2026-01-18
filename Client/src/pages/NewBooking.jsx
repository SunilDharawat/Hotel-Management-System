// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MainLayout } from "@/components/layout/MainLayout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// // import { useCustomers, useRooms } from "@/contexts/App";
// import { useAuth } from "@/contexts/AppContext";
// import { toast } from "sonner";
// import { format, differenceInDays } from "date-fns";
// import { useQuery } from "@tanstack/react-query";
// import { roomsAPI } from "@/api/rooms";
// import { useSettings } from "@/hooks/useSettings";
// import { useCreateBooking } from "@/hooks/useBookings";
// import { useCustomers } from "@/hooks/useCustomers";

// export default function NewBooking() {
//   const navigate = useNavigate();
//   const { customers } = useCustomers();
//   console.log(customers, "c");

//   const { data: rooms, isLoading: roomsLoading } = useQuery({
//     queryKey: ["rooms"],
//     queryFn: () => roomsAPI.getAll(),
//     select: (response) => response.data.rooms,
//   });
//   // const { updateRoom } = useRooms();
//   // const { addBooking } = useBookings();
//   // const { settings } = useSettings();
//   const { data: settings, isLoading, error } = useSettings();

//   const { addBooking } = useCreateBooking();
//   const { user } = useAuth();

//   const availableRooms = rooms?.filter((r) => r.status === "available");

//   const [formData, setFormData] = useState({
//     customerId: "",
//     roomId: "",
//     checkIn: format(new Date(), "yyyy-MM-dd"),
//     checkOut: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
//     numberOfGuests: 1,
//     advancePayment: 0,
//     paymentMethod: "cash",
//     specialRequests: "",
//   });

//   const selectedRoom = rooms?.find((r) => r.id === formData.roomId);
//   const nights = differenceInDays(
//     new Date(formData.checkOut),
//     new Date(formData.checkIn)
//   );
//   const roomCharges = selectedRoom ? selectedRoom.basePrice * nights : 0;
//   const cgst = roomCharges * (settings?.gst_rates?.cgst / 100);
//   const sgst = roomCharges * (settings?.gst_rates?.sgst / 100);
//   const totalAmount = roomCharges + cgst + sgst;

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.customerId || !formData.roomId) {
//       toast.error("Please select a customer and room");
//       return;
//     }

//     if (nights <= 0) {
//       toast.error("Check-out date must be after check-in date");
//       return;
//     }

//     const booking = {
//       id: `booking-${Date.now()}`,
//       ...formData,
//       numberOfGuests: parseInt(formData.numberOfGuests),
//       advancePayment: parseFloat(formData.advancePayment) || 0,
//       checkIn: new Date(formData.checkIn),
//       checkOut: new Date(formData.checkOut),
//       status: "confirmed",
//       totalAmount,
//       paymentStatus:
//         formData.advancePayment >= totalAmount
//           ? "paid"
//           : formData.advancePayment > 0
//           ? "partial"
//           : "pending",
//       createdAt: new Date(),
//       createdBy: user?.id,
//     };

//     addBooking(booking);

//     if (selectedRoom) {
//       // updateRoom({ ...selectedRoom, status: "reserved" });
//     }

//     toast.success("Booking created successfully!");
//     navigate("/bookings");
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   return (
//     <MainLayout title="New Booking" subtitle="Create a new room reservation">
//       <div className="max-w-4xl mx-auto animate-fade-in">
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-6 lg:grid-cols-3">
//             {/* Booking Details */}
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Guest & Room Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="col-span-2">
//                       <Label>Select Guest</Label>
//                       <Select
//                         value={formData.customerId}
//                         onValueChange={(value) =>
//                           setFormData({ ...formData, customerId: value })
//                         }
//                       >
//                         <SelectTrigger className="bg-background">
//                           <SelectValue placeholder="Choose a guest" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-popover">
//                           {customers?.map((customer) => (
//                             <SelectItem key={customer.id} value={customer.id}>
//                               {customer.full_name} - {customer.contact_number}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="col-span-2">
//                       <Label>Select Room</Label>
//                       <Select
//                         value={formData.roomId}
//                         onValueChange={(value) =>
//                           setFormData({ ...formData, roomId: value })
//                         }
//                       >
//                         <SelectTrigger className="bg-background">
//                           <SelectValue placeholder="Choose a room" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-popover">
//                           {availableRooms?.map((room) => (
//                             <SelectItem key={room.id} value={room.id}>
//                               Room {room.roomNumber} - {room.type} (
//                               {formatCurrency(room.basePrice)}/night)
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div>
//                       <Label>Check-in Date</Label>
//                       <Input
//                         type="date"
//                         value={formData.checkIn}
//                         onChange={(e) =>
//                           setFormData({ ...formData, checkIn: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <Label>Check-out Date</Label>
//                       <Input
//                         type="date"
//                         value={formData.checkOut}
//                         onChange={(e) =>
//                           setFormData({ ...formData, checkOut: e.target.value })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <Label>Number of Guests</Label>
//                       <Input
//                         type="number"
//                         min="1"
//                         max={selectedRoom?.maxOccupancy || 4}
//                         value={formData.numberOfGuests}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             numberOfGuests: e.target.value,
//                           })
//                         }
//                       />
//                     </div>

//                     <div>
//                       <Label>Payment Method</Label>
//                       <Select
//                         value={formData.paymentMethod}
//                         onValueChange={(value) =>
//                           setFormData({ ...formData, paymentMethod: value })
//                         }
//                       >
//                         <SelectTrigger className="bg-background">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent className="bg-popover">
//                           <SelectItem value="cash">Cash</SelectItem>
//                           <SelectItem value="card">Card</SelectItem>
//                           <SelectItem value="online">Online</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="col-span-2">
//                       <Label>Advance Payment</Label>
//                       <Input
//                         type="number"
//                         min="0"
//                         value={formData.advancePayment}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             advancePayment: e.target.value,
//                           })
//                         }
//                       />
//                     </div>

//                     <div className="col-span-2">
//                       <Label>Special Requests</Label>
//                       <Textarea
//                         value={formData.specialRequests}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             specialRequests: e.target.value,
//                           })
//                         }
//                         placeholder="Any special requests or notes..."
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Price Summary */}
//             <div>
//               <Card className="sticky top-24">
//                 <CardHeader>
//                   <CardTitle>Price Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {selectedRoom && (
//                     <>
//                       <div className="p-4 rounded-lg bg-muted">
//                         <p className="font-semibold">
//                           Room {selectedRoom.roomNumber}
//                         </p>
//                         <p className="text-sm text-muted-foreground capitalize">
//                           {selectedRoom.type}
//                         </p>
//                       </div>

//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span>Room Rate</span>
//                           <span>
//                             {formatCurrency(selectedRoom.basePrice)}/night
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Nights</span>
//                           <span>{nights > 0 ? nights : 0}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span>Room Charges</span>
//                           <span>{formatCurrency(roomCharges)}</span>
//                         </div>
//                         <div className="flex justify-between text-muted-foreground">
//                           <span>CGST ({settings.gstRates.cgst}%)</span>
//                           <span>{formatCurrency(cgst)}</span>
//                         </div>
//                         <div className="flex justify-between text-muted-foreground">
//                           <span>SGST ({settings.gstRates.sgst}%)</span>
//                           <span>{formatCurrency(sgst)}</span>
//                         </div>
//                         <div className="border-t pt-2 flex justify-between font-bold text-lg">
//                           <span>Total</span>
//                           <span>{formatCurrency(totalAmount)}</span>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <div className="flex gap-2 pt-4">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="flex-1"
//                       onClick={() => navigate("/bookings")}
//                     >
//                       Cancel
//                     </Button>
//                     <Button type="submit" className="flex-1 hotel-button-gold">
//                       Confirm Booking
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </form>
//       </div>
//     </MainLayout>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersAPI } from "@/api/customers";
import { roomsAPI } from "@/api/rooms";
import { bookingsAPI } from "@/api/bookings";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";

export default function NewBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customer_id: "",
    room_id: "",
    check_in_date: format(new Date(), "yyyy-MM-dd"),
    check_out_date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
    number_of_guests: 1,
    advance_payment: 0,
    special_requests: "",
  });

  // Fetch customers
  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", { limit: 100 }],
    queryFn: () => customersAPI.getAll({ limit: 100 }),
  });

  // Fetch available rooms
  const { data: availableRoomsData, isLoading: roomsLoading } = useQuery({
    queryKey: [
      "rooms",
      "available",
      formData.check_in_date,
      formData.check_out_date,
    ],
    queryFn: () =>
      roomsAPI.checkAvailability({
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
      }),
    enabled: !!formData.check_in_date && !!formData.check_out_date,
  });

  // Fetch settings
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
    select: (data) => data.data,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Booking created successfully!");
      navigate("/bookings");
    },
    onError: (error) => {
      toast.error("Failed to create booking", {
        description: error.message,
      });
    },
  });

  const customers = customersData?.data?.customers || [];
  const availableRooms = availableRoomsData?.data?.rooms || [];
  const gstRates = settings?.data?.gst_rates || { cgst: 6, sgst: 6 };

  const selectedRoom = availableRooms.find((r) => r.id === formData.room_id);
  const nights = differenceInDays(
    new Date(formData.check_out_date),
    new Date(formData.check_in_date)
  );
  const roomCharges = selectedRoom ? selectedRoom.base_price * nights : 0;
  const cgst = roomCharges * (gstRates.cgst / 100);
  const sgst = roomCharges * (gstRates.sgst / 100);
  const totalAmount = roomCharges + cgst + sgst;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_id || !formData.room_id) {
      toast.error("Please select a customer and room");
      return;
    }

    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const bookingData = {
      customer_id: formData.customer_id,
      room_id: formData.room_id,
      check_in_date: formData.check_in_date,
      check_out_date: formData.check_out_date,
      number_of_guests: parseInt(formData.number_of_guests),
      advance_payment: parseFloat(formData.advance_payment) || 0,
      special_requests: formData.special_requests || null,
      room_rate: selectedRoom.base_price,
      status: "confirmed",
    };

    await createBookingMutation.mutateAsync(bookingData);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isLoading = customersLoading || roomsLoading;

  return (
    <MainLayout title="New Booking" subtitle="Create a new room reservation">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-100">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Booking Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest & Room Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label className="mb-1">Select Guest *</Label>
                        <Select
                          value={formData.customer_id}
                          onValueChange={(value) =>
                            setFormData({ ...formData, customer_id: value })
                          }
                          disabled={createBookingMutation.isPending}
                        >
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Choose a guest" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {customers.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                No customers found
                              </div>
                            ) : (
                              customers.map((customer) => (
                                <SelectItem
                                  key={customer.id}
                                  value={customer.id}
                                >
                                  {customer.full_name} -{" "}
                                  {customer.contact_number}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-1">Check-in Date *</Label>
                        <Input
                          type="date"
                          value={formData.check_in_date}
                          min={format(new Date(), "yyyy-MM-dd")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              check_in_date: e.target.value,
                            })
                          }
                          disabled={createBookingMutation.isPending}
                        />
                      </div>

                      <div>
                        <Label className="mb-1">Check-out Date *</Label>
                        <Input
                          type="date"
                          value={formData.check_out_date}
                          min={formData.check_in_date}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              check_out_date: e.target.value,
                            })
                          }
                          disabled={createBookingMutation.isPending}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label className="mb-1">Select Room *</Label>
                        <Select
                          value={formData.room_id}
                          onValueChange={(value) =>
                            setFormData({ ...formData, room_id: value })
                          }
                          disabled={createBookingMutation.isPending}
                        >
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Choose a room" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {availableRooms.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                No rooms available for selected dates
                              </div>
                            ) : (
                              availableRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  Room {room.room_number} - {room.type} (
                                  {formatCurrency(room.base_price)}/night)
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {availableRooms.length === 0 &&
                          formData.check_in_date &&
                          formData.check_out_date && (
                            <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              No rooms available. Try different dates.
                            </p>
                          )}
                      </div>

                      <div>
                        <Label className="mb-1">Number of Guests *</Label>
                        <Input
                          type="number"
                          min="1"
                          max={selectedRoom?.max_occupancy}
                          value={formData.number_of_guests}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              number_of_guests: e.target.value,
                            })
                          }
                          disabled={createBookingMutation.isPending}
                        />
                        {selectedRoom &&
                          formData.number_of_guests >
                            selectedRoom.max_occupancy && (
                            <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                              Maximum occupancy for this room is{" "}
                              {selectedRoom.max_occupancy}
                            </p>
                          )}
                      </div>

                      <div>
                        <Label className="mb-1">Advance Payment (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          max={totalAmount}
                          value={formData.advance_payment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              advance_payment: e.target.value,
                            })
                          }
                          disabled={createBookingMutation.isPending}
                        />
                      </div>

                      <div className="col-span-2">
                        <Label className="mb-1">Special Requests</Label>
                        <Textarea
                          value={formData.special_requests}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              special_requests: e.target.value,
                            })
                          }
                          placeholder="Any special requests or notes..."
                          disabled={createBookingMutation.isPending}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Price Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Price Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedRoom ? (
                      <>
                        <div className="p-4 rounded-lg bg-muted">
                          <p className="font-semibold">
                            Room {selectedRoom.room_number}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {selectedRoom.type}
                          </p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Room Rate</span>
                            <span>
                              {formatCurrency(selectedRoom.base_price)}/night
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Nights</span>
                            <span>{nights > 0 ? nights : 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Room Charges</span>
                            <span>{formatCurrency(roomCharges)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>CGST ({gstRates.cgst}%)</span>
                            <span>{formatCurrency(cgst)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>SGST ({gstRates.sgst}%)</span>
                            <span>{formatCurrency(sgst)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(totalAmount)}</span>
                          </div>
                          {formData.advance_payment > 0 && (
                            <>
                              <div className="flex justify-between text-green-600">
                                <span>Advance Payment</span>
                                <span>
                                  {formatCurrency(formData.advance_payment)}
                                </span>
                              </div>
                              <div className="flex justify-between font-semibold text-orange-600">
                                <span>Balance Due</span>
                                <span>
                                  {formatCurrency(
                                    totalAmount - formData.advance_payment
                                  )}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Select a room to see pricing</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/bookings")}
                        disabled={createBookingMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 hotel-button-gold"
                        disabled={
                          createBookingMutation.isPending ||
                          !formData.customer_id ||
                          !formData.room_id
                        }
                      >
                        {createBookingMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
}
