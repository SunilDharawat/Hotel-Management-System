import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsAPI } from "@/api/bookings";
import { roomsAPI } from "@/api/rooms";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";
import { format, differenceInDays, addDays } from "date-fns";
import {
  CalendarPlus,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export function ExtendStayModal({ isOpen, onClose, booking }) {
  const queryClient = useQueryClient();

  const originalCheckOut = new Date(booking.check_out_date);
  const minNewDate = format(addDays(originalCheckOut, 1), "yyyy-MM-dd");

  const [newCheckOut, setNewCheckOut] = useState(
    format(addDays(originalCheckOut, 1), "yyyy-MM-dd"),
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch settings for pricing
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
  });

  // Check availability for extended dates
  const { data: availabilityData } = useQuery({
    queryKey: [
      "room-availability",
      booking.room_id,
      originalCheckOut,
      newCheckOut,
    ],
    queryFn: () =>
      roomsAPI.checkAvailability({
        check_in_date: format(originalCheckOut, "yyyy-MM-dd"),
        check_out_date: newCheckOut,
        room_type: booking.room_type,
      }),
    enabled: !!newCheckOut,
  });

  const gstRates = settings?.data?.gst_rates || {};
  const gstState = settings?.data?.hotel_state || {};

  const isSameState =
    String(gstState.state_id) === booking.customer_gst_state_code;

  // Calculate additional charges
  const additionalNights = differenceInDays(
    new Date(newCheckOut),
    originalCheckOut,
  );
  const roomRate = booking.room_rate || 0;
  const additionalRoomCharges = additionalNights * roomRate;
  const additionalCgst = isSameState
    ? additionalRoomCharges * (gstRates.cgst / 100)
    : 0;

  const additionalSgst = isSameState
    ? additionalRoomCharges * (gstRates.sgst / 100)
    : 0;

  const additionalIgst = !isSameState
    ? additionalRoomCharges * (gstRates.igst / 100)
    : 0;

  const totalAdditionalCharges =
    additionalRoomCharges + additionalCgst + additionalSgst + additionalIgst;

  // Check if the same room is available
  const availableRooms = availabilityData?.data?.rooms || [];
  const isRoomAvailable = availableRooms.some(
    (room) => room.id === booking.room_id,
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExtend = async () => {
    if (!isRoomAvailable) {
      toast.error("Room is not available for the selected dates");
      return;
    }

    if (additionalNights <= 0) {
      toast.error("New checkout date must be after current checkout date");
      return;
    }

    try {
      setIsProcessing(true);

      // Update booking with new checkout date
      await bookingsAPI.update(booking.id, {
        check_out_date: newCheckOut,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      toast.success(
        `Stay extended to ${format(new Date(newCheckOut), "MMM d, yyyy")}`,
      );
      onClose();
    } catch (error) {
      toast.error("Failed to extend stay", {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            Extend Stay
          </DialogTitle>
          <DialogDescription>
            Extend the guest's checkout date and calculate additional charges
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

          {/* Current Dates */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>
                {format(new Date(booking.check_in_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Check-out</span>
              <span>{format(originalCheckOut, "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* New Checkout Date */}
          <div>
            <Label>New Check-out Date</Label>
            <Input
              type="date"
              min={minNewDate}
              value={newCheckOut}
              onChange={(e) => setNewCheckOut(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          {/* Availability Check */}
          {!isRoomAvailable && additionalNights > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Room is not available for the selected dates. Please choose a
                different date or contact front desk.
              </AlertDescription>
            </Alert>
          )}

          {isRoomAvailable && additionalNights > 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Room is available for {additionalNights} additional night
                {additionalNights > 1 ? "s" : ""}
              </AlertDescription>
            </Alert>
          )}

          {/* Additional Charges */}
          {additionalNights > 0 && (
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  Additional Nights ({additionalNights} ×{" "}
                  {formatCurrency(roomRate)})
                </span>
                <span>{formatCurrency(additionalRoomCharges)}</span>
              </div>
              {isSameState ? (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST ({gstRates.cgst}%)</span>
                    <span>{formatCurrency(additionalCgst)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST ({gstRates.sgst}%)</span>
                    <span>{formatCurrency(additionalSgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-muted-foreground">
                  <span>IGST ({gstRates.igst}%)</span>
                  <span>{formatCurrency(additionalIgst)}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Additional Charges</span>
                <span>{formatCurrency(totalAdditionalCharges)}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Note: Payment will be collected at checkout
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExtend}
              className="flex-1 hotel-button-gold"
              disabled={
                !isRoomAvailable || additionalNights <= 0 || isProcessing
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extending...
                </>
              ) : (
                "Confirm Extension"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
