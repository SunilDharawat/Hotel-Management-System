// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   useCustomers,
//   useBookings,
//   useRooms,
//   useSettings,
//   useAuth,
// } from "@/contexts/App";
// import { toast } from "sonner";
// import { format, differenceInDays } from "date-fns";
// import { UserPlus, Calendar, CheckCircle } from "lucide-react";

// export function QuickBookingModal({ isOpen, onClose, room }) {
//   const { customers, addCustomer } = useCustomers();
//   const { addBooking } = useBookings();
//   const { updateRoom } = useRooms();
//   const { settings } = useSettings();
//   const { user } = useAuth();

//   const [step, setStep] = useState(1);
//   const [selectedCustomerId, setSelectedCustomerId] = useState("");
//   const [isNewCustomer, setIsNewCustomer] = useState(false);

//   const [newCustomer, setNewCustomer] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     idProofType: "aadhar",
//     idProofNumber: "",
//     address: "",
//     gender: "male",
//     nationality: "Indian",
//   });

//   const [bookingDetails, setBookingDetails] = useState({
//     checkIn: format(new Date(), "yyyy-MM-dd"),
//     checkOut: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
//     numberOfGuests: 1,
//     advancePayment: 0,
//     paymentMethod: "cash",
//     specialRequests: "",
//   });

//   const nights = differenceInDays(
//     new Date(bookingDetails.checkOut),
//     new Date(bookingDetails.checkIn)
//   );
//   const roomCharges = room.basePrice * nights;
//   const cgst = roomCharges * (settings.gstRates.cgst / 100);
//   const sgst = roomCharges * (settings.gstRates.sgst / 100);
//   const totalAmount = roomCharges + cgst + sgst;

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const handleNext = () => {
//     if (step === 1) {
//       if (!isNewCustomer && !selectedCustomerId) {
//         toast.error("Please select a customer");
//         return;
//       }
//       if (isNewCustomer && (!newCustomer.name || !newCustomer.phone)) {
//         toast.error("Please fill in required customer details");
//         return;
//       }
//     }
//     if (step === 2) {
//       if (nights <= 0) {
//         toast.error("Check-out date must be after check-in");
//         return;
//       }
//     }
//     setStep(step + 1);
//   };

//   const handleConfirm = () => {
//     let customerId = selectedCustomerId;

//     if (isNewCustomer) {
//       const customer = {
//         id: `cust-${Date.now()}`,
//         ...newCustomer,
//         createdAt: new Date(),
//         totalStays: 0,
//         totalSpent: 0,
//       };
//       addCustomer(customer);
//       customerId = customer.id;
//     }

//     const booking = {
//       id: `booking-${Date.now()}`,
//       customerId,
//       roomId: room.id,
//       checkIn: new Date(bookingDetails.checkIn),
//       checkOut: new Date(bookingDetails.checkOut),
//       numberOfGuests: parseInt(bookingDetails.numberOfGuests),
//       status: "confirmed",
//       totalAmount,
//       advancePayment: parseFloat(bookingDetails.advancePayment) || 0,
//       paymentStatus:
//         bookingDetails.advancePayment >= totalAmount
//           ? "paid"
//           : bookingDetails.advancePayment > 0
//           ? "partial"
//           : "pending",
//       paymentMethod: bookingDetails.paymentMethod,
//       specialRequests: bookingDetails.specialRequests,
//       createdAt: new Date(),
//       createdBy: user?.id,
//     };

//     addBooking(booking);
//     updateRoom({ ...room, status: "reserved" });

//     toast.success("Booking created successfully!");
//     onClose();
//   };

//   const resetAndClose = () => {
//     setStep(1);
//     setSelectedCustomerId("");
//     setIsNewCustomer(false);
//     setNewCustomer({
//       name: "",
//       email: "",
//       phone: "",
//       idProofType: "aadhar",
//       idProofNumber: "",
//       address: "",
//       gender: "male",
//       nationality: "Indian",
//     });
//     setBookingDetails({
//       checkIn: format(new Date(), "yyyy-MM-dd"),
//       checkOut: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
//       numberOfGuests: 1,
//       advancePayment: 0,
//       paymentMethod: "cash",
//       specialRequests: "",
//     });
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={resetAndClose}>
//       <DialogContent className="max-w-lg bg-background">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             {step === 1 && (
//               <>
//                 <UserPlus className="h-5 w-5" />
//                 Select Guest
//               </>
//             )}
//             {step === 2 && (
//               <>
//                 <Calendar className="h-5 w-5" />
//                 Booking Details
//               </>
//             )}
//             {step === 3 && (
//               <>
//                 <CheckCircle className="h-5 w-5" />
//                 Confirm Booking
//               </>
//             )}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Step 1: Customer Selection */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <div className="flex gap-2">
//                 <Button
//                   type="button"
//                   variant={!isNewCustomer ? "default" : "outline"}
//                   onClick={() => setIsNewCustomer(false)}
//                   className="flex-1"
//                 >
//                   Existing Guest
//                 </Button>
//                 <Button
//                   type="button"
//                   variant={isNewCustomer ? "default" : "outline"}
//                   onClick={() => setIsNewCustomer(true)}
//                   className="flex-1"
//                 >
//                   New Guest
//                 </Button>
//               </div>

//               {!isNewCustomer ? (
//                 <div>
//                   <Label>Select Guest</Label>
//                   <Select
//                     value={selectedCustomerId}
//                     onValueChange={setSelectedCustomerId}
//                   >
//                     <SelectTrigger className="bg-background">
//                       <SelectValue placeholder="Choose a guest" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-popover">
//                       {customers.map((customer) => (
//                         <SelectItem key={customer.id} value={customer.id}>
//                           {customer.name} - {customer.phone}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2">
//                     <Label>Full Name *</Label>
//                     <Input
//                       value={newCustomer.name}
//                       onChange={(e) =>
//                         setNewCustomer({ ...newCustomer, name: e.target.value })
//                       }
//                       placeholder="Enter full name"
//                     />
//                   </div>
//                   <div>
//                     <Label>Phone *</Label>
//                     <Input
//                       value={newCustomer.phone}
//                       onChange={(e) =>
//                         setNewCustomer({
//                           ...newCustomer,
//                           phone: e.target.value,
//                         })
//                       }
//                       placeholder="+91 98765 43210"
//                     />
//                   </div>
//                   <div>
//                     <Label>Email</Label>
//                     <Input
//                       type="email"
//                       value={newCustomer.email}
//                       onChange={(e) =>
//                         setNewCustomer({
//                           ...newCustomer,
//                           email: e.target.value,
//                         })
//                       }
//                       placeholder="email@example.com"
//                     />
//                   </div>
//                   <div>
//                     <Label>ID Type</Label>
//                     <Select
//                       value={newCustomer.idProofType}
//                       onValueChange={(value) =>
//                         setNewCustomer({ ...newCustomer, idProofType: value })
//                       }
//                     >
//                       <SelectTrigger className="bg-background">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent className="bg-popover">
//                         <SelectItem value="aadhar">Aadhar Card</SelectItem>
//                         <SelectItem value="passport">Passport</SelectItem>
//                         <SelectItem value="driving_license">
//                           Driving License
//                         </SelectItem>
//                         <SelectItem value="voter_id">Voter ID</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label>ID Number</Label>
//                     <Input
//                       value={newCustomer.idProofNumber}
//                       onChange={(e) =>
//                         setNewCustomer({
//                           ...newCustomer,
//                           idProofNumber: e.target.value,
//                         })
//                       }
//                       placeholder="ID number"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Step 2: Booking Details */}
//           {step === 2 && (
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Check-in</Label>
//                 <Input
//                   type="date"
//                   value={bookingDetails.checkIn}
//                   onChange={(e) =>
//                     setBookingDetails({
//                       ...bookingDetails,
//                       checkIn: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Check-out</Label>
//                 <Input
//                   type="date"
//                   value={bookingDetails.checkOut}
//                   onChange={(e) =>
//                     setBookingDetails({
//                       ...bookingDetails,
//                       checkOut: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Guests</Label>
//                 <Input
//                   type="number"
//                   min="1"
//                   max={room.maxOccupancy}
//                   value={bookingDetails.numberOfGuests}
//                   onChange={(e) =>
//                     setBookingDetails({
//                       ...bookingDetails,
//                       numberOfGuests: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Payment Method</Label>
//                 <Select
//                   value={bookingDetails.paymentMethod}
//                   onValueChange={(value) =>
//                     setBookingDetails({
//                       ...bookingDetails,
//                       paymentMethod: value,
//                     })
//                   }
//                 >
//                   <SelectTrigger className="bg-background">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-popover">
//                     <SelectItem value="cash">Cash</SelectItem>
//                     <SelectItem value="card">Card</SelectItem>
//                     <SelectItem value="online">Online</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="col-span-2">
//                 <Label>Advance Payment</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={bookingDetails.advancePayment}
//                   onChange={(e) =>
//                     setBookingDetails({
//                       ...bookingDetails,
//                       advancePayment: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 3: Confirmation */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <div className="p-4 rounded-lg bg-muted">
//                 <h4 className="font-semibold mb-2">Room {room.roomNumber}</h4>
//                 <p className="text-sm text-muted-foreground capitalize">
//                   {room.type} Room
//                 </p>
//               </div>

//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Check-in</span>
//                   <span>
//                     {format(new Date(bookingDetails.checkIn), "MMM d, yyyy")}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Check-out</span>
//                   <span>
//                     {format(new Date(bookingDetails.checkOut), "MMM d, yyyy")}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Nights</span>
//                   <span>{nights}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Room Charges</span>
//                   <span>{formatCurrency(roomCharges)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>CGST ({settings.gstRates.cgst}%)</span>
//                   <span>{formatCurrency(cgst)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>SGST ({settings.gstRates.sgst}%)</span>
//                   <span>{formatCurrency(sgst)}</span>
//                 </div>
//                 <div className="border-t pt-2 flex justify-between font-bold">
//                   <span>Total Amount</span>
//                   <span>{formatCurrency(totalAmount)}</span>
//                 </div>
//                 <div className="flex justify-between text-green-600">
//                   <span>Advance Payment</span>
//                   <span>- {formatCurrency(bookingDetails.advancePayment)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Balance Due</span>
//                   <span>
//                     {formatCurrency(
//                       totalAmount - bookingDetails.advancePayment
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex gap-2 pt-4">
//             {step > 1 && (
//               <Button
//                 variant="outline"
//                 onClick={() => setStep(step - 1)}
//                 className="flex-1"
//               >
//                 Back
//               </Button>
//             )}
//             {step < 3 ? (
//               <Button onClick={handleNext} className="flex-1 hotel-button-gold">
//                 Next
//               </Button>
//             ) : (
//               <Button
//                 onClick={handleConfirm}
//                 className="flex-1 hotel-button-gold"
//               >
//                 Confirm Booking
//               </Button>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersAPI } from "@/api/customers";
import { bookingsAPI } from "@/api/bookings";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import {
  UserPlus,
  Calendar,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function QuickBookingModal({ isOpen, onClose, room }) {
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    id_proof_type: "aadhar",
    id_proof_number: "",
    address: "",
    gender: "male",
  });

  const [bookingDetails, setBookingDetails] = useState({
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
    enabled: !isNewCustomer,
  });

  // Fetch settings for GST
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: customersAPI.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      return response;
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Booking created successfully!");
      resetAndClose();
    },
    onError: (error) => {
      toast.error("Failed to create booking", {
        description: error.message,
      });
    },
  });

  const customers = customersData?.data?.customers || [];
  const gstRates = settings?.data?.gst_rates || { cgst: 6, sgst: 6 };

  const nights = differenceInDays(
    new Date(bookingDetails.check_out_date),
    new Date(bookingDetails.check_in_date)
  );
  const roomCharges = room.base_price * nights;
  const cgst = roomCharges * (gstRates.cgst / 100);
  const sgst = roomCharges * (gstRates.sgst / 100);
  const totalAmount = roomCharges + cgst + sgst;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!isNewCustomer && !selectedCustomerId) {
        toast.error("Please select a customer");
        return;
      }
      if (isNewCustomer) {
        if (!newCustomer.full_name || !newCustomer.contact_number) {
          toast.error("Please fill in required customer details");
          return;
        }
        if (!newCustomer.id_proof_number || !newCustomer.id_proof_type) {
          toast.error("ID proof details are required");
          return;
        }
        if (newCustomer.contact_number.length < 10) {
          toast.error("Please enter a valid phone number");
          return;
        }
      }
    }
    if (step === 2) {
      if (nights <= 0) {
        toast.error("Check-out date must be after check-in");
        return;
      }
      if (bookingDetails.number_of_guests > room.max_occupancy) {
        toast.error(
          `Maximum ${room.max_occupancy} guests allowed for this room`
        );
        return;
      }
    }
    setStep(step + 1);
  };

  const handleConfirm = async () => {
    try {
      let customerId = selectedCustomerId;

      // Create new customer if needed
      if (isNewCustomer) {
        const customerResponse = await createCustomerMutation.mutateAsync(
          newCustomer
        );
        customerId = customerResponse.data.id;
      }

      // Create booking
      const bookingData = {
        customer_id: customerId,
        room_id: room.id,
        check_in_date: bookingDetails.check_in_date,
        check_out_date: bookingDetails.check_out_date,
        number_of_guests: parseInt(bookingDetails.number_of_guests),
        advance_payment: parseFloat(bookingDetails.advance_payment) || 0,
        special_requests: bookingDetails.special_requests || null,
        room_rate: room.base_price,
        status: "confirmed",
      };

      await createBookingMutation.mutateAsync(bookingData);
    } catch (error) {
      // Error already handled in mutations
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedCustomerId("");
    setIsNewCustomer(false);
    setNewCustomer({
      full_name: "",
      email: "",
      contact_number: "",
      id_proof_type: "aadhar",
      id_proof_number: "",
      address: "",
      gender: "male",
    });
    setBookingDetails({
      check_in_date: format(new Date(), "yyyy-MM-dd"),
      check_out_date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd"),
      number_of_guests: 1,
      advance_payment: 0,
      special_requests: "",
    });
    onClose();
  };

  const isProcessing =
    createCustomerMutation.isPending || createBookingMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && (
              <>
                <UserPlus className="h-5 w-5" />
                Select Guest
              </>
            )}
            {step === 2 && (
              <>
                <Calendar className="h-5 w-5" />
                Booking Details
              </>
            )}
            {step === 3 && (
              <>
                <CheckCircle className="h-5 w-5" />
                Confirm Booking
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Customer Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!isNewCustomer ? "default" : "outline"}
                  onClick={() => setIsNewCustomer(false)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Existing Guest
                </Button>
                <Button
                  type="button"
                  variant={isNewCustomer ? "default" : "outline"}
                  onClick={() => setIsNewCustomer(true)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  New Guest
                </Button>
              </div>

              {!isNewCustomer ? (
                <div>
                  <Label>Select Guest</Label>
                  {customersLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Select
                      value={selectedCustomerId}
                      onValueChange={setSelectedCustomerId}
                      disabled={isProcessing}
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
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.full_name} - {customer.contact_number}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={newCustomer.full_name}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          full_name: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.contact_number}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          contact_number: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="9876543210"
                      maxLength={15}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label>ID Type *</Label>
                    <Select
                      value={newCustomer.id_proof_type}
                      onValueChange={(value) =>
                        setNewCustomer({ ...newCustomer, id_proof_type: value })
                      }
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving_license">
                          Driving License
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ID Number *</Label>
                    <Input
                      value={newCustomer.id_proof_number}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          id_proof_number: e.target.value,
                        })
                      }
                      placeholder="ID number"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={newCustomer.address}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter address"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select
                      value={newCustomer.gender}
                      onValueChange={(value) =>
                        setNewCustomer({ ...newCustomer, gender: value })
                      }
                      disabled={isProcessing}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Room Info */}
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-1">Room {room.room_number}</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {room.type} • Max {room.max_occupancy} guests
                </p>
                <p className="text-sm font-medium text-primary mt-1">
                  {formatCurrency(room.base_price)}/night
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Check-in *</Label>
                  <Input
                    type="date"
                    value={bookingDetails.check_in_date}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        check_in_date: e.target.value,
                      })
                    }
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label>Check-out *</Label>
                  <Input
                    type="date"
                    value={bookingDetails.check_out_date}
                    min={bookingDetails.check_in_date}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        check_out_date: e.target.value,
                      })
                    }
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <Label>Guests *</Label>
                  <Input
                    type="number"
                    min="1"
                    max={room.max_occupancy}
                    value={bookingDetails.number_of_guests}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        number_of_guests: e.target.value,
                      })
                    }
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Max: {room.max_occupancy} guests
                  </p>
                </div>
                <div>
                  <Label>Advance Payment (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    max={totalAmount}
                    value={bookingDetails.advance_payment}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        advance_payment: e.target.value,
                      })
                    }
                    disabled={isProcessing}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Special Requests</Label>
                  <Input
                    value={bookingDetails.special_requests}
                    onChange={(e) =>
                      setBookingDetails({
                        ...bookingDetails,
                        special_requests: e.target.value,
                      })
                    }
                    placeholder="Any special requests..."
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Quick Summary */}
              {nights > 0 && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-blue-900">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {nights} night{nights > 1 ? "s" : ""} • Total:{" "}
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">Room {room.room_number}</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {room.type} Room
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guest</span>
                  <span className="font-medium">
                    {isNewCustomer
                      ? newCustomer.full_name
                      : customers.find((c) => c.id === selectedCustomerId)
                          ?.full_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span>
                    {format(
                      new Date(bookingDetails.check_in_date),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span>
                    {format(
                      new Date(bookingDetails.check_out_date),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span>{bookingDetails.number_of_guests}</span>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
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
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                {bookingDetails.advance_payment > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Advance Payment</span>
                      <span>
                        - {formatCurrency(bookingDetails.advance_payment)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-orange-600">
                      <span>Balance Due</span>
                      <span>
                        {formatCurrency(
                          totalAmount - bookingDetails.advance_payment
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
                disabled={isProcessing}
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="flex-1 hotel-button-gold"
                disabled={isProcessing}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                className="flex-1 hotel-button-gold"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
