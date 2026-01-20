import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Printer, Download, X } from "lucide-react";
import { customersAPI } from "@/api/customers";
import { bookingsAPI } from "@/api/bookings";
import { roomsAPI } from "@/api/rooms";
import { useSettings } from "@/hooks/useSettings";
import { invoicesAPI } from "@/api/invoices";

export function InvoiceViewModal({ isOpen, onClose, invoice }) {
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomsAPI.getAll(),
    select: (response) => response.data.rooms,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingsAPI.getAll(),
    select: (response) => response.data.bookings,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersAPI.getAll(),
    select: (response) => response.data.customers,
  });

  const { data: invoiceItems, isLoading: invoiceItemsLoading } = useQuery({
    queryKey: ["invoiceItems", invoice.id],
    queryFn: () => invoicesAPI.getById(invoice.id),
    select: (response) => response.data,
  });

  const { data: settings, settingLoading, settingError } = useSettings();

  const customer = customers?.find((c) => c.id === invoice.customer_id);

  const booking = bookings?.find((b) => b.id === invoice.booking_id);
  const room = booking ? rooms?.find((r) => r.id === booking.room_id) : null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader className="print:hidden">
          <DialogTitle>Tax Invoice </DialogTitle>
        </DialogHeader>

        {/* Printable Invoice Content */}
        <div id="invoice-content" className="space-y-4 p-3 bg-white print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-primary">
                {settings?.general?.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {settings?.general?.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {settings?.general?.phone} | {settings?.general?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                GST: {settings?.general?.gst_number}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">INVOICE</h2>
              <p className="text-sm font-medium">{invoice.invoice_number}</p>
              <p className="text-sm text-muted-foreground">
                Date: {format(new Date(invoice.created_at), "dd/MM/yyyy")}
              </p>
              <Badge
                className={
                  invoice.payment_status === "paid"
                    ? "bg-green-100 text-green-700 mt-2"
                    : "bg-yellow-100 text-yellow-700 mt-2"
                }
              >
                {invoice.payment_status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Customer & Stay Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-medium">{customer?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {customer?.contact_number}
              </p>
              <p className="text-sm text-muted-foreground">{customer?.email}</p>
              {customer?.gstNumber && (
                <p className="text-sm text-muted-foreground">
                  GST: {customer.gstNumber}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stay Details:</h3>
              <p className="text-sm">
                Room: {room?.room_number} ({room?.type})
              </p>
              {booking && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Check-in:{" "}
                    {format(new Date(booking.check_in_date), "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check-out:{" "}
                    {format(new Date(booking.check_out_date), "dd/MM/yyyy")}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-2 px-3 text-left text-sm font-semibold">
                  Description
                </th>
                <th className="py-2 px-3 text-center text-sm font-semibold">
                  Qty
                </th>
                <th className="py-2 px-3 text-right text-sm font-semibold">
                  Rate
                </th>
                <th className="py-2 px-3 text-right text-sm font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems?.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3 text-sm">{item.description}</td>
                  <td className="py-2 px-3 text-center text-sm">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 text-right text-sm">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="py-2 px-3 text-right text-sm">
                    {formatCurrency(item.total_price)}
                  </td>
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
                <span>CGST ({settings?.gst_rates.cgst}%):</span>
                <span>{formatCurrency(invoice.cgst_amount)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>SGST ({settings?.gst_rates.sgst}%):</span>
                <span>{formatCurrency(invoice.sgst_amount)}</span>
              </div>
              {invoice.igst_amount > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IGST ({settings?.gst_rates.igst}%):</span>
                  <span>{formatCurrency(invoice.igst_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Grand Total:</span>
                <span>{formatCurrency(invoice.grand_total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span className="capitalize">
                {invoiceItems?.payments[0].payment_method}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.amount_paid)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-4 text-sm text-muted-foreground">
            <p>Thank you for staying at {settings?.general?.name}!</p>
            <p>We look forward to welcoming you again.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
