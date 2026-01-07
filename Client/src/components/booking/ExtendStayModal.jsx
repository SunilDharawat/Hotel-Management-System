import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBookings, useRooms, useCustomers, useSettings } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { format, differenceInDays, addDays } from 'date-fns';
import { CalendarPlus, AlertTriangle, CheckCircle } from 'lucide-react';

export function ExtendStayModal({ isOpen, onClose, booking }) {
  const { bookings, updateBooking } = useBookings();
  const { rooms } = useRooms();
  const { customers } = useCustomers();
  const { settings } = useSettings();

  const room = rooms.find(r => r.id === booking.roomId);
  const customer = customers.find(c => c.id === booking.customerId);

  const originalCheckOut = new Date(booking.checkOut);
  const minNewDate = format(addDays(originalCheckOut, 1), 'yyyy-MM-dd');
  
  const [newCheckOut, setNewCheckOut] = useState(format(addDays(originalCheckOut, 1), 'yyyy-MM-dd'));
  const [additionalPayment, setAdditionalPayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Check room availability for extended dates
  const checkAvailability = () => {
    const extendedBookings = bookings.filter(b => 
      b.id !== booking.id && 
      b.roomId === booking.roomId && 
      b.status !== 'cancelled' &&
      b.status !== 'checked_out'
    );

    const newCheckOutDate = new Date(newCheckOut);
    
    for (const existingBooking of extendedBookings) {
      const existingCheckIn = new Date(existingBooking.checkIn);
      const existingCheckOut = new Date(existingBooking.checkOut);
      
      // Check if extension conflicts with existing booking
      if (originalCheckOut < existingCheckOut && newCheckOutDate > existingCheckIn) {
        return {
          available: false,
          conflictingBooking: existingBooking
        };
      }
    }
    
    return { available: true };
  };

  const availability = checkAvailability();
  
  // Calculate additional charges
  const additionalNights = differenceInDays(new Date(newCheckOut), originalCheckOut);
  const roomRate = room?.basePrice || 0;
  const additionalRoomCharges = additionalNights * roomRate;
  const additionalCgst = additionalRoomCharges * (settings.gstRates.cgst / 100);
  const additionalSgst = additionalRoomCharges * (settings.gstRates.sgst / 100);
  const totalAdditionalCharges = additionalRoomCharges + additionalCgst + additionalSgst;
  const balanceDue = totalAdditionalCharges - (parseFloat(additionalPayment) || 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleExtend = () => {
    if (!availability.available) {
      toast.error('Room is not available for the selected dates');
      return;
    }

    if (additionalNights <= 0) {
      toast.error('New checkout date must be after current checkout date');
      return;
    }

    const newTotalAmount = booking.totalAmount + totalAdditionalCharges;
    const newAdvancePayment = (booking.advancePayment || 0) + (parseFloat(additionalPayment) || 0);

    updateBooking({
      ...booking,
      checkOut: new Date(newCheckOut),
      totalAmount: newTotalAmount,
      advancePayment: newAdvancePayment,
      paymentStatus: newAdvancePayment >= newTotalAmount ? 'paid' : newAdvancePayment > 0 ? 'partial' : 'pending',
      extensionHistory: [
        ...(booking.extensionHistory || []),
        {
          extendedAt: new Date(),
          previousCheckOut: originalCheckOut,
          newCheckOut: new Date(newCheckOut),
          additionalCharges: totalAdditionalCharges,
          additionalPayment: parseFloat(additionalPayment) || 0,
          paymentMethod
        }
      ]
    });

    toast.success(`Stay extended to ${format(new Date(newCheckOut), 'MMM d, yyyy')}`);
    onClose();
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
            <p className="font-semibold">{customer?.name}</p>
            <p className="text-sm text-muted-foreground">Room {room?.roomNumber} • {room?.type}</p>
          </div>

          {/* Current Dates */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>{format(new Date(booking.checkIn), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Check-out</span>
              <span>{format(originalCheckOut, 'MMM d, yyyy')}</span>
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
            />
          </div>

          {/* Availability Check */}
          {!availability.available && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Room is not available. There's a booking from {format(new Date(availability.conflictingBooking.checkIn), 'MMM d')} to {format(new Date(availability.conflictingBooking.checkOut), 'MMM d')}.
              </AlertDescription>
            </Alert>
          )}

          {availability.available && additionalNights > 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Room is available for {additionalNights} additional night{additionalNights > 1 ? 's' : ''}
              </AlertDescription>
            </Alert>
          )}

          {/* Additional Charges */}
          {additionalNights > 0 && (
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Additional Nights ({additionalNights} × {formatCurrency(roomRate)})</span>
                <span>{formatCurrency(additionalRoomCharges)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>CGST ({settings.gstRates.cgst}%)</span>
                <span>{formatCurrency(additionalCgst)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>SGST ({settings.gstRates.sgst}%)</span>
                <span>{formatCurrency(additionalSgst)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Additional Charges</span>
                <span>{formatCurrency(totalAdditionalCharges)}</span>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Additional Payment</Label>
              <Input
                type="number"
                min="0"
                value={additionalPayment}
                onChange={(e) => setAdditionalPayment(e.target.value)}
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {balanceDue > 0 && (
            <div className="flex justify-between font-bold text-lg text-orange-600">
              <span>Balance Due</span>
              <span>{formatCurrency(balanceDue)}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleExtend} 
              className="flex-1 hotel-button-gold"
              disabled={!availability.available || additionalNights <= 0}
            >
              Confirm Extension
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
