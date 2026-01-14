import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsAPI } from "@/api/bookings";
import { invoicesAPI } from "@/api/invoices";
import { paymentsAPI } from "@/api/payments";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { Receipt, Download, Loader2, Printer } from "lucide-react";

export function CheckoutModal({ isOpen, onClose, booking }) {
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch settings for GST rates
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
  });

  const gstRates = settings?.data?.gst_rates || { cgst: 6, sgst: 6 };

  // Calculate charges
  const nights = differenceInDays(
    new Date(booking.check_out_date),
    new Date(booking.check_in_date)
  );
  const roomCharges = booking.room_rate * nights;
  const cgst = roomCharges * (gstRates.cgst / 100);
  const sgst = roomCharges * (gstRates.sgst / 100);
  const totalTax = cgst + sgst;
  const grandTotal = roomCharges + totalTax;
  const advancePaid = booking.advance_payment || 0;
  const balanceDue = grandTotal - advancePaid;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      // Step 1: Checkout the booking
      await bookingsAPI.checkOut(booking.id);

      // Step 2: Create invoice from booking
      const invoiceResponse = await invoicesAPI.createFromBooking({
        booking_id: booking.id,
        additional_items: [], // Add any additional charges here if needed
      });

      const invoice = invoiceResponse.data;

      // Step 3: Record payment if there's balance due
      if (balanceDue > 0) {
        await paymentsAPI.create({
          invoice_id: invoice.id,
          amount: balanceDue,
          payment_method: paymentMethod,
          payment_reference: `CHECKOUT-${booking.booking_number}`,
          notes: `Checkout payment for booking ${booking.booking_number}`,
          payment_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        });
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });

      toast.success("Checkout completed successfully!");

      // Option to download/print invoice
      if (window.confirm("Would you like to download the invoice?")) {
        handleDownloadInvoice(invoice);
      }

      onClose();
    } catch (error) {
      toast.error("Checkout failed", {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadInvoice = (invoice) => {
    // Generate PDF invoice
    const printWindow = window.open("", "_blank");
    printWindow.document.write(generateInvoiceHTML(invoice, booking));
    printWindow.document.close();
    printWindow.print();
  };

  const generateInvoiceHTML = (invoice, booking) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .hotel-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .invoice-title { font-size: 20px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f4f4f4; }
          .text-right { text-align: right; }
          .totals { margin-top: 20px; }
          .total-row { font-weight: bold; font-size: 16px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hotel-name">${
            settings?.data?.general?.name || "Vrindavan Palace"
          }</div>
          <div>${settings?.data?.general?.address || ""}</div>
          <div>Phone: ${settings?.data?.general?.phone || ""} | Email: ${
      settings?.data?.general?.email || ""
    }</div>
          <div>GST No: ${settings?.data?.general?.gst_number || ""}</div>
        </div>

        <div class="invoice-title">TAX INVOICE</div>

        <table>
          <tr>
            <td><strong>Invoice No:</strong> ${invoice.invoice_number}</td>
            <td><strong>Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</td>
          </tr>
          <tr>
            <td><strong>Booking No:</strong> ${booking.booking_number}</td>
            <td><strong>Payment Status:</strong> ${invoice.payment_status}</td>
          </tr>
        </table>

        <h3>Bill To:</h3>
        <table>
          <tr>
            <td><strong>Name:</strong> ${booking.customer_name}</td>
            <td><strong>Phone:</strong> ${booking.customer_phone || ""}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Check-in:</strong> ${format(
              new Date(booking.check_in_date),
              "dd/MM/yyyy"
            )} | <strong>Check-out:</strong> ${format(
      new Date(booking.check_out_date),
      "dd/MM/yyyy"
    )}</td>
          </tr>
        </table>

        <h3>Invoice Items:</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Room ${booking.room_number} (${
      booking.room_type
    }) - ${nights} night(s)</td>
              <td class="text-right">${nights}</td>
              <td class="text-right">${formatCurrency(booking.room_rate)}</td>
              <td class="text-right">${formatCurrency(roomCharges)}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <table style="width: 400px; margin-left: auto;">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">${formatCurrency(roomCharges)}</td>
            </tr>
            <tr>
              <td>CGST (${gstRates.cgst}%):</td>
              <td class="text-right">${formatCurrency(cgst)}</td>
            </tr>
            <tr>
              <td>SGST (${gstRates.sgst}%):</td>
              <td class="text-right">${formatCurrency(sgst)}</td>
            </tr>
            <tr class="total-row">
              <td>Grand Total:</td>
              <td class="text-right">${formatCurrency(grandTotal)}</td>
            </tr>
            ${
              advancePaid > 0
                ? `
            <tr>
              <td>Advance Paid:</td>
              <td class="text-right">${formatCurrency(advancePaid)}</td>
            </tr>
            <tr class="total-row">
              <td>Balance Paid:</td>
              <td class="text-right">${formatCurrency(balanceDue)}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <div class="footer">
          <p>Thank you for choosing ${
            settings?.data?.general?.name || "Vrindavan Palace"
          }!</p>
          <p>This is a computer-generated invoice.</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Checkout - Room {booking.room_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Guest Info */}
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-semibold">{booking.customer_name}</p>
            <p className="text-sm text-muted-foreground">
              {booking.customer_phone}
            </p>
          </div>

          {/* Stay Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in</span>
              <span>
                {format(new Date(booking.check_in_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out</span>
              <span>
                {format(new Date(booking.check_out_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span>
                {nights} night{nights > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>
                Room Charges ({nights} × {formatCurrency(booking.room_rate)})
              </span>
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
          {balanceDue > 0 && (
            <div>
              <Label className="mb-1">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={handleCheckout}
              className="flex-1 hotel-button-gold"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4 mr-2" />
                  Complete Checkout
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
