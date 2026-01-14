// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   useBookings,
//   useRooms,
//   useCustomers,
//   useInvoices,
//   useSettings,
// } from "@/contexts/App";
// import { toast } from "sonner";
// import { format, differenceInDays } from "date-fns";
// import { XCircle, AlertTriangle } from "lucide-react";

// export function CancellationModal({ isOpen, onClose, booking }) {
//   const { updateBooking } = useBookings();
//   const { rooms, updateRoom } = useRooms();
//   const { customers } = useCustomers();
//   const { addInvoice } = useInvoices();
//   const { settings } = useSettings();

//   const [reason, setReason] = useState("");
//   const [refundMethod, setRefundMethod] = useState("cash");

//   const room = rooms.find((r) => r.id === booking.roomId);
//   const customer = customers.find((c) => c.id === booking.customerId);

//   const isEarlyCheckout = booking.status === "checked_in";
//   const today = new Date();

//   // Calculate charges for early checkout
//   const originalCheckIn = new Date(booking.checkIn);
//   const originalCheckOut = new Date(booking.checkOut);
//   const nightsStayed = isEarlyCheckout
//     ? Math.max(1, differenceInDays(today, originalCheckIn))
//     : 0;
//   const originalNights = differenceInDays(originalCheckOut, originalCheckIn);

//   const roomRate = room?.basePrice || 0;
//   const chargesForStay = nightsStayed * roomRate;
//   const cgst = chargesForStay * (settings.gstRates.cgst / 100);
//   const sgst = chargesForStay * (settings.gstRates.sgst / 100);
//   const totalCharges = chargesForStay + cgst + sgst;

//   const advancePaid = booking.advancePayment || 0;

//   // Cancellation fee (10% of total booking if cancelling before check-in)
//   const cancellationFee = !isEarlyCheckout ? booking.totalAmount * 0.1 : 0;

//   const refundAmount = isEarlyCheckout
//     ? Math.max(0, advancePaid - totalCharges)
//     : Math.max(0, advancePaid - cancellationFee);

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const handleCancellation = () => {
//     if (isEarlyCheckout) {
//       // Create invoice for early checkout
//       const invoice = {
//         id: `inv-${Date.now()}`,
//         invoiceNumber: `INV-${format(new Date(), "yyyy")}-${String(
//           Date.now()
//         ).slice(-4)}`,
//         bookingId: booking.id,
//         customerId: booking.customerId,
//         items: [
//           {
//             description: `Room Charges - ${
//               room?.type || "Room"
//             } (${nightsStayed} night${nightsStayed > 1 ? "s" : ""})`,
//             quantity: nightsStayed,
//             unitPrice: roomRate,
//             total: chargesForStay,
//           },
//         ],
//         subtotal: chargesForStay,
//         cgst,
//         sgst,
//         igst: 0,
//         totalTax: cgst + sgst,
//         grandTotal: totalCharges,
//         paidAmount: advancePaid,
//         refundAmount: refundAmount,
//         paymentMethod: refundMethod,
//         paymentStatus: refundAmount > 0 ? "refunded" : "paid",
//         notes: `Early checkout. Original checkout: ${format(
//           originalCheckOut,
//           "MMM d, yyyy"
//         )}. Reason: ${reason}`,
//         createdAt: new Date(),
//         dueDate: new Date(),
//       };
//       addInvoice(invoice);
//     }

//     // Update booking status
//     updateBooking({
//       ...booking,
//       status: "cancelled",
//       cancellationReason: reason,
//       cancellationDate: new Date(),
//       refundAmount: refundAmount,
//       refundMethod: refundMethod,
//     });

//     // Update room status
//     if (room && (room.status === "occupied" || room.status === "reserved")) {
//       updateRoom({
//         ...room,
//         status: isEarlyCheckout ? "cleaning" : "available",
//       });
//     }

//     toast.success(
//       isEarlyCheckout
//         ? "Early checkout processed successfully!"
//         : "Booking cancelled successfully!"
//     );
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md bg-background">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-destructive">
//             {isEarlyCheckout ? (
//               <>
//                 <AlertTriangle className="h-5 w-5" />
//                 Early Checkout
//               </>
//             ) : (
//               <>
//                 <XCircle className="h-5 w-5" />
//                 Cancel Booking
//               </>
//             )}
//           </DialogTitle>
//           <DialogDescription>
//             {isEarlyCheckout
//               ? "Process early checkout and calculate final charges"
//               : "This action will cancel the booking and process any applicable refunds"}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Guest & Room Info */}
//           <div className="p-4 rounded-lg bg-muted">
//             <p className="font-semibold">{customer?.name}</p>
//             <p className="text-sm text-muted-foreground">
//               Room {room?.roomNumber} • {room?.type}
//             </p>
//           </div>

//           {/* Booking Details */}
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Original Check-in</span>
//               <span>{format(originalCheckIn, "MMM d, yyyy")}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Original Check-out</span>
//               <span>{format(originalCheckOut, "MMM d, yyyy")}</span>
//             </div>
//             {isEarlyCheckout && (
//               <div className="flex justify-between font-medium text-orange-600">
//                 <span>Actual Check-out</span>
//                 <span>{format(today, "MMM d, yyyy")}</span>
//               </div>
//             )}
//           </div>

//           {/* Financial Summary */}
//           <div className="border-t pt-4 space-y-2 text-sm">
//             {isEarlyCheckout ? (
//               <>
//                 <div className="flex justify-between">
//                   <span>
//                     Nights Stayed ({nightsStayed} × {formatCurrency(roomRate)})
//                   </span>
//                   <span>{formatCurrency(chargesForStay)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>CGST ({settings.gstRates.cgst}%)</span>
//                   <span>{formatCurrency(cgst)}</span>
//                 </div>
//                 <div className="flex justify-between text-muted-foreground">
//                   <span>SGST ({settings.gstRates.sgst}%)</span>
//                   <span>{formatCurrency(sgst)}</span>
//                 </div>
//                 <div className="flex justify-between font-semibold border-t pt-2">
//                   <span>Total Charges</span>
//                   <span>{formatCurrency(totalCharges)}</span>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="flex justify-between">
//                   <span>Original Booking Amount</span>
//                   <span>{formatCurrency(booking.totalAmount)}</span>
//                 </div>
//                 <div className="flex justify-between text-orange-600">
//                   <span>Cancellation Fee (10%)</span>
//                   <span>{formatCurrency(cancellationFee)}</span>
//                 </div>
//               </>
//             )}

//             <div className="flex justify-between">
//               <span>Advance Paid</span>
//               <span>{formatCurrency(advancePaid)}</span>
//             </div>

//             {refundAmount > 0 ? (
//               <div className="flex justify-between font-bold text-lg text-green-600 border-t pt-2">
//                 <span>Refund Amount</span>
//                 <span>{formatCurrency(refundAmount)}</span>
//               </div>
//             ) : (
//               <div className="flex justify-between font-bold text-lg text-destructive border-t pt-2">
//                 <span>Amount Due</span>
//                 <span>{formatCurrency(Math.abs(refundAmount))}</span>
//               </div>
//             )}
//           </div>

//           {/* Refund Method */}
//           {refundAmount > 0 && (
//             <div>
//               <Label>Refund Method</Label>
//               <Select value={refundMethod} onValueChange={setRefundMethod}>
//                 <SelectTrigger className="bg-background">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-popover">
//                   <SelectItem value="cash">Cash</SelectItem>
//                   <SelectItem value="card">Card Refund</SelectItem>
//                   <SelectItem value="online">Online Transfer</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Reason */}
//           <div>
//             <Label>
//               Reason for {isEarlyCheckout ? "Early Checkout" : "Cancellation"}
//             </Label>
//             <Textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Enter the reason..."
//               rows={3}
//             />
//           </div>

//           <div className="flex gap-2 pt-4">
//             <Button variant="outline" onClick={onClose} className="flex-1">
//               Go Back
//             </Button>
//             <Button
//               onClick={handleCancellation}
//               variant="destructive"
//               className="flex-1"
//             >
//               {isEarlyCheckout
//                 ? "Process Early Checkout"
//                 : "Confirm Cancellation"}
//             </Button>
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsAPI } from "@/api/bookings";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";

export function CancellationModal({ isOpen, onClose, booking }) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch settings for cancellation policy
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
  });

  const policies = settings?.data?.policies || {};
  const gstRates = settings?.data?.gst_rates || { cgst: 6, sgst: 6 };

  const isEarlyCheckout = booking.status === "checked_in";
  const today = new Date();

  // Calculate charges for early checkout
  const originalCheckIn = new Date(booking.check_in_date);
  const originalCheckOut = new Date(booking.check_out_date);
  const nightsStayed = isEarlyCheckout
    ? Math.max(1, differenceInDays(today, originalCheckIn))
    : 0;
  const originalNights = differenceInDays(originalCheckOut, originalCheckIn);

  const roomRate = booking.room_rate || 0;
  const chargesForStay = nightsStayed * roomRate;
  const cgst = chargesForStay * (gstRates.cgst / 100);
  const sgst = chargesForStay * (gstRates.sgst / 100);
  const totalCharges = chargesForStay + cgst + sgst;

  const advancePaid = booking.advance_payment || 0;

  // Cancellation fee (from settings or default 10%)
  const cancellationPercent = policies.early_checkout_refund_percent || 10;
  const cancellationFee = !isEarlyCheckout
    ? booking.total_amount * (cancellationPercent / 100)
    : 0;

  const refundAmount = isEarlyCheckout
    ? Math.max(0, advancePaid - totalCharges)
    : Math.max(0, advancePaid - cancellationFee);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCancellation = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    if (reason.trim().length < 10) {
      toast.error("Cancellation reason must be at least 10 characters");
      return;
    }

    try {
      setIsProcessing(true);

      if (isEarlyCheckout) {
        // For early checkout, do checkout first
        await bookingsAPI.checkOut(booking.id);
        toast.success("Early checkout processed successfully!");
      } else {
        // For cancellation before check-in
        await bookingsAPI.cancel(booking.id, reason);
        toast.success("Booking cancelled successfully!");
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      onClose();
    } catch (error) {
      toast.error(
        isEarlyCheckout ? "Early checkout failed" : "Cancellation failed",
        { description: error.message }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            {isEarlyCheckout ? (
              <>
                <AlertTriangle className="h-5 w-5" />
                Early Checkout
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                Cancel Booking
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEarlyCheckout
              ? "Process early checkout and calculate final charges"
              : "This action will cancel the booking and process any applicable refunds"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Guest & Room Info */}
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-semibold">{booking.customer_name}</p>
            <p className="text-sm text-muted-foreground">
              Room {booking.room_number} • {booking.room_type}
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Check-in</span>
              <span>{format(originalCheckIn, "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Check-out</span>
              <span>{format(originalCheckOut, "MMM d, yyyy")}</span>
            </div>
            {isEarlyCheckout && (
              <div className="flex justify-between font-medium text-orange-600">
                <span>Actual Check-out</span>
                <span>{format(today, "MMM d, yyyy")}</span>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            {isEarlyCheckout ? (
              <>
                <div className="flex justify-between">
                  <span>
                    Nights Stayed ({nightsStayed} × {formatCurrency(roomRate)})
                  </span>
                  <span>{formatCurrency(chargesForStay)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>CGST ({gstRates.cgst}%)</span>
                  <span>{formatCurrency(cgst)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST ({gstRates.sgst}%)</span>
                  <span>{formatCurrency(sgst)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total Charges</span>
                  <span>{formatCurrency(totalCharges)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Original Booking Amount</span>
                  <span>{formatCurrency(booking.total_amount)}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Cancellation Fee ({cancellationPercent}%)</span>
                  <span>{formatCurrency(cancellationFee)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span>Advance Paid</span>
              <span>{formatCurrency(advancePaid)}</span>
            </div>

            {refundAmount > 0 ? (
              <div className="flex justify-between font-bold text-lg text-green-600 border-t pt-2">
                <span>Refund Amount</span>
                <span>{formatCurrency(refundAmount)}</span>
              </div>
            ) : (
              <div className="flex justify-between font-bold text-lg text-destructive border-t pt-2">
                <span>Amount Due</span>
                <span>{formatCurrency(Math.abs(refundAmount))}</span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <Label>
              Reason for {isEarlyCheckout ? "Early Checkout" : "Cancellation"} *
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason (minimum 10 characters)..."
              rows={3}
              disabled={isProcessing}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Go Back
            </Button>
            <Button
              onClick={handleCancellation}
              variant="destructive"
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isEarlyCheckout
                    ? "Process Early Checkout"
                    : "Confirm Cancellation"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
