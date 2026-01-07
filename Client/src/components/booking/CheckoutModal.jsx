import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookings, useRooms, useCustomers, useInvoices, useSettings } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { Receipt } from 'lucide-react';

export function CheckoutModal({ isOpen, onClose, booking }) {
  const { updateBooking } = useBookings();
  const { rooms, updateRoom } = useRooms();
  const { customers } = useCustomers();
  const { addInvoice } = useInvoices();
  const { settings } = useSettings();

  const [paymentMethod, setPaymentMethod] = useState(booking.paymentMethod || 'cash');

  const room = rooms.find(r => r.id === booking.roomId);
  const customer = customers.find(c => c.id === booking.customerId);

  const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
  const roomCharges = room ? room.basePrice * nights : 0;
  const cgst = roomCharges * (settings.gstRates.cgst / 100);
  const sgst = roomCharges * (settings.gstRates.sgst / 100);
  const totalTax = cgst + sgst;
  const grandTotal = roomCharges + totalTax;
  const advancePaid = booking.advancePayment || 0;
  const balanceDue = grandTotal - advancePaid;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCheckout = () => {
    // Create invoice
    const invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${format(new Date(), 'yyyy')}-${String(Date.now()).slice(-4)}`,
      bookingId: booking.id,
      customerId: booking.customerId,
      items: [
        {
          description: `Room Charges - ${room?.type || 'Room'} (${nights} night${nights > 1 ? 's' : ''})`,
          quantity: nights,
          unitPrice: room?.basePrice || 0,
          total: roomCharges
        }
      ],
      subtotal: roomCharges,
      cgst,
      sgst,
      igst: 0,
      totalTax,
      grandTotal,
      paidAmount: grandTotal,
      paymentMethod,
      paymentStatus: 'paid',
      createdAt: new Date(),
      dueDate: new Date()
    };

    addInvoice(invoice);

    // Update booking status
    updateBooking({
      ...booking,
      status: 'checked_out',
      paymentStatus: 'paid',
      paymentMethod
    });

    // Update room status
    if (room) {
      updateRoom({ ...room, status: 'cleaning' });
    }

    toast.success('Checkout completed successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Checkout - Room {room?.roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Guest Info */}
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-semibold">{customer?.name}</p>
            <p className="text-sm text-muted-foreground">{customer?.phone}</p>
          </div>

          {/* Stay Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>{format(new Date(booking.checkIn), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span>{format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Room Charges ({nights} × {formatCurrency(room?.basePrice || 0)})</span>
              <span>{formatCurrency(roomCharges)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>CGST ({settings.gstRates.cgst}%)</span>
              <span>{formatCurrency(cgst)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>SGST ({settings.gstRates.sgst}%)</span>
              <span>{formatCurrency(sgst)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
            {advancePaid > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Advance Paid</span>
                <span>- {formatCurrency(advancePaid)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg">
              <span>Balance Due</span>
              <span>{formatCurrency(balanceDue)}</span>
            </div>
          </div>

          {/* Payment Method */}
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

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCheckout} className="flex-1 hotel-button-gold">
              Complete Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
