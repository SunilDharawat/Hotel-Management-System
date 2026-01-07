import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers, useBookings, useRooms, useSettings } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { Printer, Download, X } from 'lucide-react';

export function InvoiceViewModal({ isOpen, onClose, invoice }) {
  const { customers } = useCustomers();
  const { bookings } = useBookings();
  const { rooms } = useRooms();
  const { settings } = useSettings();

  const customer = customers.find(c => c.id === invoice.customerId);
  const booking = bookings.find(b => b.id === invoice.bookingId);
  const room = booking ? rooms.find(r => r.id === booking.roomId) : null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('PDF download functionality would be implemented here');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader className="print:hidden">
          <DialogTitle>Invoice {invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        {/* Printable Invoice Content */}
        <div id="invoice-content" className="space-y-6 p-6 bg-white print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-primary">{settings.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{settings.address}</p>
              <p className="text-sm text-muted-foreground">{settings.phone} | {settings.email}</p>
              <p className="text-sm text-muted-foreground">GST: {settings.gstNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">
                Date: {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
              </p>
              <Badge className={invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 mt-2' : 'bg-yellow-100 text-yellow-700 mt-2'}>
                {invoice.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Customer & Stay Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-medium">{customer?.name}</p>
              <p className="text-sm text-muted-foreground">{customer?.phone}</p>
              <p className="text-sm text-muted-foreground">{customer?.email}</p>
              {customer?.gstNumber && (
                <p className="text-sm text-muted-foreground">GST: {customer.gstNumber}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stay Details:</h3>
              <p className="text-sm">Room: {room?.roomNumber} ({room?.type})</p>
              {booking && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Check-in: {format(new Date(booking.checkIn), 'dd/MM/yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check-out: {format(new Date(booking.checkOut), 'dd/MM/yyyy')}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-2 px-3 text-left text-sm font-semibold">Description</th>
                <th className="py-2 px-3 text-center text-sm font-semibold">Qty</th>
                <th className="py-2 px-3 text-right text-sm font-semibold">Rate</th>
                <th className="py-2 px-3 text-right text-sm font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3 text-sm">{item.description}</td>
                  <td className="py-2 px-3 text-center text-sm">{item.quantity}</td>
                  <td className="py-2 px-3 text-right text-sm">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2 px-3 text-right text-sm">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>CGST ({settings.gstRates.cgst}%):</span>
                <span>{formatCurrency(invoice.cgst)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>SGST ({settings.gstRates.sgst}%):</span>
                <span>{formatCurrency(invoice.sgst)}</span>
              </div>
              {invoice.igst > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IGST ({settings.gstRates.igst}%):</span>
                  <span>{formatCurrency(invoice.igst)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Grand Total:</span>
                <span>{formatCurrency(invoice.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span className="capitalize">{invoice.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.paidAmount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-4 text-sm text-muted-foreground">
            <p>Thank you for staying at {settings.name}!</p>
            <p>We look forward to welcoming you again.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 print:hidden">
          <Button variant="outline" onClick={handlePrint} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
