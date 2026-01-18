// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { bookingsAPI } from "@/api/bookings";
// import { invoicesAPI } from "@/api/invoices";
// import { paymentsAPI } from "@/api/payments";
// import { settingsAPI } from "@/api/settings";
// import { toast } from "sonner";
// import { format, differenceInDays } from "date-fns";
// import { Receipt, Download, Loader2, Printer } from "lucide-react";

// export function CheckoutModal({ isOpen, onClose, booking }) {
//   const queryClient = useQueryClient();
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Fetch settings for GST rates
//   const { data: settings } = useQuery({
//     queryKey: ["settings"],
//     queryFn: settingsAPI.getAll,
//   });

//   const gstRates = settings?.data?.gst_rates || { cgst: 6, sgst: 6 };

//   // Calculate charges
//   const nights = differenceInDays(
//     new Date(booking.check_out_date),
//     new Date(booking.check_in_date)
//   );
//   const roomCharges = booking.room_rate * nights;
//   const cgst = roomCharges * (gstRates.cgst / 100);
//   const sgst = roomCharges * (gstRates.sgst / 100);
//   const totalTax = cgst + sgst;
//   const grandTotal = roomCharges + totalTax;
//   const advancePaid = booking.advance_payment || 0;
//   const balanceDue = grandTotal - advancePaid;

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const handleCheckout = async () => {
//     try {
//       setIsProcessing(true);

//       // Step 1: Checkout the booking
//       await bookingsAPI.checkOut(booking.id);

//       // Step 2: Create invoice from booking
//       const invoiceResponse = await invoicesAPI.createFromBooking({
//         booking_id: booking.id,
//         additional_items: [], // Add any additional charges here if needed
//       });

//       const invoice = invoiceResponse.data;

//       // Step 3: Record payment if there's balance due
//       if (balanceDue > 0) {
//         await paymentsAPI.create({
//           invoice_id: invoice.id,
//           amount: balanceDue,
//           payment_method: paymentMethod,
//           payment_reference: `CHECKOUT-${booking.booking_number}`,
//           notes: `Checkout payment for booking ${booking.booking_number}`,
//           payment_date: new Date().toISOString().slice(0, 19).replace("T", " "),
//         });
//       }

//       // Invalidate queries to refresh data
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//       queryClient.invalidateQueries({ queryKey: ["invoices"] });

//       toast.success("Checkout completed successfully!");

//       // Option to download/print invoice
//       if (window.confirm("Would you like to download the invoice?")) {
//         handleDownloadInvoice(invoice);
//       }

//       onClose();
//     } catch (error) {
//       toast.error("Checkout failed", {
//         description: error.message,
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleDownloadInvoice = (invoice) => {
//     // Generate PDF invoice
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(generateInvoiceHTML(invoice, booking));
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const generateInvoiceHTML = (invoice, booking) => {
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Invoice - ${invoice.invoice_number}</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 40px; }
//           .header { text-align: center; margin-bottom: 30px; }
//           .hotel-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
//           .invoice-title { font-size: 20px; margin: 20px 0; }
//           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//           th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
//           th { background-color: #f4f4f4; }
//           .text-right { text-align: right; }
//           .totals { margin-top: 20px; }
//           .total-row { font-weight: bold; font-size: 16px; }
//           .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <div class="hotel-name">${
//             settings?.data?.general?.name || "Vrindavan Palace"
//           }</div>
//           <div>${settings?.data?.general?.address || ""}</div>
//           <div>Phone: ${settings?.data?.general?.phone || ""} | Email: ${
//       settings?.data?.general?.email || ""
//     }</div>
//           <div>GST No: ${settings?.data?.general?.gst_number || ""}</div>
//         </div>

//         <div class="invoice-title">TAX INVOICE</div>

//         <table>
//           <tr>
//             <td><strong>Invoice No:</strong> ${invoice.invoice_number}</td>
//             <td><strong>Date:</strong> ${format(new Date(), "dd/MM/yyyy")}</td>
//           </tr>
//           <tr>
//             <td><strong>Booking No:</strong> ${booking.booking_number}</td>
//             <td><strong>Payment Status:</strong> ${invoice.payment_status}</td>
//           </tr>
//         </table>

//         <h3>Bill To:</h3>
//         <table>
//           <tr>
//             <td><strong>Name:</strong> ${booking.customer_name}</td>
//             <td><strong>Phone:</strong> ${booking.customer_phone || ""}</td>
//           </tr>
//           <tr>
//             <td colspan="2"><strong>Check-in:</strong> ${format(
//               new Date(booking.check_in_date),
//               "dd/MM/yyyy"
//             )} | <strong>Check-out:</strong> ${format(
//       new Date(booking.check_out_date),
//       "dd/MM/yyyy"
//     )}</td>
//           </tr>
//         </table>

//         <h3>Invoice Items:</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Description</th>
//               <th class="text-right">Qty</th>
//               <th class="text-right">Rate</th>
//               <th class="text-right">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>Room ${booking.room_number} (${
//       booking.room_type
//     }) - ${nights} night(s)</td>
//               <td class="text-right">${nights}</td>
//               <td class="text-right">${formatCurrency(booking.room_rate)}</td>
//               <td class="text-right">${formatCurrency(roomCharges)}</td>
//             </tr>
//           </tbody>
//         </table>

//         <div class="totals">
//           <table style="width: 400px; margin-left: auto;">
//             <tr>
//               <td>Subtotal:</td>
//               <td class="text-right">${formatCurrency(roomCharges)}</td>
//             </tr>
//             <tr>
//               <td>CGST (${gstRates.cgst}%):</td>
//               <td class="text-right">${formatCurrency(cgst)}</td>
//             </tr>
//             <tr>
//               <td>SGST (${gstRates.sgst}%):</td>
//               <td class="text-right">${formatCurrency(sgst)}</td>
//             </tr>
//             <tr class="total-row">
//               <td>Grand Total:</td>
//               <td class="text-right">${formatCurrency(grandTotal)}</td>
//             </tr>
//             ${
//               advancePaid > 0
//                 ? `
//             <tr>
//               <td>Advance Paid:</td>
//               <td class="text-right">${formatCurrency(advancePaid)}</td>
//             </tr>
//             <tr class="total-row">
//               <td>Balance Paid:</td>
//               <td class="text-right">${formatCurrency(balanceDue)}</td>
//             </tr>
//             `
//                 : ""
//             }
//           </table>
//         </div>

//         <div class="footer">
//           <p>Thank you for choosing ${
//             settings?.data?.general?.name || "Vrindavan Palace"
//           }!</p>
//           <p>This is a computer-generated invoice.</p>
//         </div>
//       </body>
//       </html>
//     `;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md bg-background">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Receipt className="h-5 w-5" />
//             Checkout - Room {booking.room_number}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Guest Info */}
//           <div className="p-4 rounded-lg bg-muted">
//             <p className="font-semibold">{booking.customer_name}</p>
//             <p className="text-sm text-muted-foreground">
//               {booking.customer_phone}
//             </p>
//           </div>

//           {/* Stay Details */}
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Check-in</span>
//               <span>
//                 {format(new Date(booking.check_in_date), "MMM d, yyyy")}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Check-out</span>
//               <span>
//                 {format(new Date(booking.check_out_date), "MMM d, yyyy")}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-muted-foreground">Duration</span>
//               <span>
//                 {nights} night{nights > 1 ? "s" : ""}
//               </span>
//             </div>
//           </div>

//           {/* Bill Summary */}
//           <div className="border-t pt-4 space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span>
//                 Room Charges ({nights} × {formatCurrency(booking.room_rate)})
//               </span>
//               <span>{formatCurrency(roomCharges)}</span>
//             </div>
//             <div className="flex justify-between text-muted-foreground">
//               <span>CGST ({gstRates.cgst}%)</span>
//               <span>{formatCurrency(cgst)}</span>
//             </div>
//             <div className="flex justify-between text-muted-foreground">
//               <span>SGST ({gstRates.sgst}%)</span>
//               <span>{formatCurrency(sgst)}</span>
//             </div>
//             <div className="flex justify-between font-semibold border-t pt-2">
//               <span>Grand Total</span>
//               <span>{formatCurrency(grandTotal)}</span>
//             </div>
//             {advancePaid > 0 && (
//               <div className="flex justify-between text-green-600">
//                 <span>Advance Paid</span>
//                 <span>- {formatCurrency(advancePaid)}</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold text-lg">
//               <span>Balance Due</span>
//               <span>{formatCurrency(balanceDue)}</span>
//             </div>
//           </div>

//           {/* Payment Method */}
//           {balanceDue > 0 && (
//             <div>
//               <Label className="mb-1">Payment Method</Label>
//               <Select value={paymentMethod} onValueChange={setPaymentMethod}>
//                 <SelectTrigger className="bg-background">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-popover">
//                   <SelectItem value="cash">Cash</SelectItem>
//                   <SelectItem value="upi">UPI</SelectItem>
//                   <SelectItem value="credit_card">Credit Card</SelectItem>
//                   <SelectItem value="debit_card">Debit Card</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <div className="flex gap-2 pt-4">
//             <Button
//               variant="outline"
//               onClick={onClose}
//               className="flex-1"
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleCheckout}
//               className="flex-1 hotel-button-gold"
//               disabled={isProcessing}
//             >
//               {isProcessing ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Printer className="h-4 w-4 mr-2" />
//                   Complete Checkout
//                 </>
//               )}
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
import { bookingsAPI } from "@/api/bookings";
import { invoicesAPI } from "@/api/invoices";
import { paymentsAPI } from "@/api/payments";
import { settingsAPI } from "@/api/settings";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import {
  Receipt,
  Loader2,
  Printer,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CheckoutModal({ isOpen, onClose, booking }) {
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Additional service charges
  const [additionalServices, setAdditionalServices] = useState([]);
  const [newService, setNewService] = useState({
    description: "",
    category: "food",
    quantity: 1,
    unit_price: 0,
  });

  // Fetch settings for GST rates
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.getAll,
  });

  const gstRates = settings?.data?.gst_rates || {};

  // Calculate room charges
  const nights = differenceInDays(
    new Date(booking.check_out_date),
    new Date(booking.check_in_date)
  );
  const roomCharges = booking.room_rate * nights;

  // Calculate additional services total
  const servicesTotal = additionalServices.reduce(
    (sum, service) => sum + service.quantity * service.unit_price,
    0
  );

  // Calculate totals
  const subtotal = roomCharges + servicesTotal;
  const cgst = subtotal * (gstRates.cgst / 100);
  const sgst = subtotal * (gstRates.sgst / 100);
  const totalTax = cgst + sgst;
  const grandTotal = subtotal + totalTax;
  const advancePaid = booking.advance_payment || 0;
  const balanceDue = grandTotal - advancePaid;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddService = () => {
    if (!newService.description || newService.unit_price <= 0) {
      toast.error("Please enter service description and price");
      return;
    }

    const service = {
      ...newService,
      total_price: newService.quantity * newService.unit_price,
    };

    setAdditionalServices([...additionalServices, service]);
    setNewService({
      description: "",
      category: "food",
      quantity: 1,
      unit_price: 0,
    });
    toast.success("Service added");
  };

  const handleRemoveService = (index) => {
    setAdditionalServices(additionalServices.filter((_, i) => i !== index));
    toast.success("Service removed");
  };

  // const handleCheckout = async () => {
  //   try {
  //     setIsProcessing(true);

  //     // Step 1: Checkout the booking
  //     await bookingsAPI.checkOut(booking.id);

  //     // Step 2: Create invoice from booking with additional items
  //     const invoiceResponse = await invoicesAPI.createFromBooking({
  //       booking_id: booking.id,
  //       additional_items: additionalServices,
  //     });

  //     const invoice = invoiceResponse.data;

  //     // Step 3: Record payment if there's balance due
  //     if (balanceDue > 0) {
  //       await paymentsAPI.create({
  //         invoice_id: invoice.id,
  //         amount: balanceDue,
  //         payment_method: paymentMethod,
  //         payment_reference: `CHECKOUT-${booking.booking_number}`,
  //         notes: `Checkout payment for booking ${booking.booking_number}`,
  //         payment_date: new Date().toISOString().slice(0, 19).replace("T", " "),
  //       });
  //     }

  //     // Invalidate queries to refresh data
  //     queryClient.invalidateQueries({ queryKey: ["bookings"] });
  //     queryClient.invalidateQueries({ queryKey: ["rooms"] });
  //     queryClient.invalidateQueries({ queryKey: ["invoices"] });

  //     toast.success("Checkout completed successfully!");

  //     // Auto-download invoice
  //     handleDownloadInvoice(invoice);

  //     onClose();
  //   } catch (error) {
  //     toast.error("Checkout failed", {
  //       description: error.message,
  //     });
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      // Step 1: Checkout the booking
      await bookingsAPI.checkOut(booking.id);

      // Step 2: Create invoice from booking with additional items
      const invoiceResponse = await invoicesAPI.createFromBooking({
        booking_id: booking.id,
        additional_items: additionalServices,
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

      // Download PDF from backend
      await handleDownloadInvoice(invoice.id);

      onClose();
    } catch (error) {
      toast.error("Checkout failed", {
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      toast.info("Generating invoice PDF...");

      // Get PDF blob from backend
      const blob = await invoicesAPI.downloadPDF(invoiceId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${booking.booking_number}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");

      // Option to view in new tab
      if (window.confirm("Would you like to view the invoice in a new tab?")) {
        const pdfUrl = invoicesAPI.getPDFUrl(invoiceId);
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      toast.error("Failed to download invoice", {
        description: error.message,
      });
    }
  };

  // const handleDownloadInvoice = (invoice) => {
  //   const printWindow = window.open("", "_blank");
  //   printWindow.document.write(generateInvoiceHTML(invoice));
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  // const generateInvoiceHTML = (invoice) => {
  //   const allItems = [
  //     {
  //       description: `Room ${booking.room_number} (${booking.room_type}) - ${nights} night(s)`,
  //       quantity: nights,
  //       unit_price: booking.room_rate,
  //       total_price: roomCharges,
  //     },
  //     ...additionalServices,
  //   ];

  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //     <head>
  //       <title>Invoice - ${invoice.invoice_number}</title>
  //       <style>
  //         * { margin: 0; padding: 0; box-sizing: border-box; }
  //         body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
  //         .container { max-width: 800px; margin: 0 auto; }
  //         .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; }
  //         .hotel-name { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 8px; }
  //         .hotel-details { font-size: 14px; color: #666; line-height: 1.6; }
  //         .invoice-title { font-size: 24px; font-weight: bold; text-align: center; margin: 30px 0; color: #1e3a8a; text-transform: uppercase; letter-spacing: 2px; }
  //         .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
  //         .info-box { flex: 1; }
  //         .info-box h3 { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
  //         .info-box p { margin: 5px 0; font-size: 14px; }
  //         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  //         th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
  //         th { background-color: #f3f4f6; font-weight: 600; text-transform: uppercase; font-size: 12px; color: #666; }
  //         td { font-size: 14px; }
  //         .text-right { text-align: right; }
  //         .text-center { text-align: center; }
  //         .totals { margin-top: 20px; }
  //         .totals table { width: 400px; margin-left: auto; }
  //         .totals td { border: none; padding: 8px 12px; }
  //         .subtotal-row { font-weight: 500; }
  //         .tax-row { color: #666; font-size: 13px; }
  //         .total-row { font-weight: bold; font-size: 18px; background-color: #f3f4f6; border-top: 2px solid #1e3a8a !important; }
  //         .paid-row { color: #059669; font-weight: 600; }
  //         .balance-row { color: #dc2626; font-weight: bold; font-size: 16px; }
  //         .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; }
  //         .footer p { font-size: 13px; color: #666; margin: 8px 0; }
  //         .thank-you { font-size: 16px; color: #1e3a8a; font-weight: 600; margin-bottom: 10px; }
  //         .category-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
  //         .category-room { background-color: #dbeafe; color: #1e40af; }
  //         .category-food { background-color: #fef3c7; color: #92400e; }
  //         .category-service { background-color: #d1fae5; color: #065f46; }
  //         .category-minibar { background-color: #fce7f3; color: #9f1239; }
  //         .category-laundry { background-color: #e0e7ff; color: #3730a3; }
  //         .category-other { background-color: #f3f4f6; color: #374151; }
  //         @media print {
  //           body { margin: 20px; }
  //           .no-print { display: none; }
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <div class="header">
  //           <div class="hotel-name">${
  //             settings?.data?.general?.name || "VRINDAVAN PALACE"
  //           }</div>
  //           <div class="hotel-details">
  //             ${settings?.data?.general?.address || ""}<br>
  //             Phone: ${settings?.data?.general?.phone || ""} | Email: ${
  //     settings?.data?.general?.email || ""
  //   }<br>
  //             GST No: ${settings?.data?.general?.gst_number || ""}
  //           </div>
  //         </div>

  //         <div class="invoice-title">Tax Invoice</div>

  //         <div class="info-section">
  //           <div class="info-box">
  //             <h3>Invoice Details</h3>
  //             <p><strong>Invoice No:</strong> ${invoice.invoice_number}</p>
  //             <p><strong>Date:</strong> ${format(
  //               new Date(),
  //               "dd MMMM yyyy"
  //             )}</p>
  //             <p><strong>Booking No:</strong> ${booking.booking_number}</p>
  //           </div>
  //           <div class="info-box" style="text-align: right;">
  //             <h3>Guest Details</h3>
  //             <p><strong>${booking.customer_name}</strong></p>
  //             <p>${booking.customer_phone || ""}</p>
  //             <p>${booking.customer_email || ""}</p>
  //           </div>
  //         </div>

  //         <div class="info-section">
  //           <div class="info-box">
  //             <h3>Stay Details</h3>
  //             <p><strong>Check-in:</strong> ${format(
  //               new Date(booking.check_in_date),
  //               "dd MMM yyyy"
  //             )}</p>
  //             <p><strong>Check-out:</strong> ${format(
  //               new Date(booking.check_out_date),
  //               "dd MMM yyyy"
  //             )}</p>
  //             <p><strong>Duration:</strong> ${nights} night(s)</p>
  //           </div>
  //           <div class="info-box" style="text-align: right;">
  //             <h3>Room Details</h3>
  //             <p><strong>Room No:</strong> ${booking.room_number}</p>
  //             <p><strong>Type:</strong> ${booking.room_type}</p>
  //             <p><strong>Guests:</strong> ${booking.number_of_guests || 1}</p>
  //           </div>
  //         </div>

  //         <h3 style="margin: 30px 0 10px 0; font-size: 16px; color: #1e3a8a;">Invoice Items</h3>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Description</th>
  //               <th class="text-center">Qty</th>
  //               <th class="text-right">Rate</th>
  //               <th class="text-right">Amount</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${allItems
  //               .map(
  //                 (item) => `
  //               <tr>
  //                 <td>
  //                   ${item.description}
  //                   ${
  //                     item.category
  //                       ? `<br><span class="category-badge category-${item.category}">${item.category}</span>`
  //                       : ""
  //                   }
  //                 </td>
  //                 <td class="text-center">${item.quantity}</td>
  //                 <td class="text-right">${formatCurrency(item.unit_price)}</td>
  //                 <td class="text-right"><strong>${formatCurrency(
  //                   item.total_price
  //                 )}</strong></td>
  //               </tr>
  //             `
  //               )
  //               .join("")}
  //           </tbody>
  //         </table>

  //         <div class="totals">
  //           <table>
  //             <tr class="subtotal-row">
  //               <td>Subtotal:</td>
  //               <td class="text-right">${formatCurrency(subtotal)}</td>
  //             </tr>
  //             <tr class="tax-row">
  //               <td>CGST @ ${gstRates.cgst}%:</td>
  //               <td class="text-right">${formatCurrency(cgst)}</td>
  //             </tr>
  //             <tr class="tax-row">
  //               <td>SGST @ ${gstRates.sgst}%:</td>
  //               <td class="text-right">${formatCurrency(sgst)}</td>
  //             </tr>
  //             <tr class="total-row">
  //               <td>Grand Total:</td>
  //               <td class="text-right">${formatCurrency(grandTotal)}</td>
  //             </tr>
  //             ${
  //               advancePaid > 0
  //                 ? `
  //             <tr class="paid-row">
  //               <td>Advance Paid:</td>
  //               <td class="text-right">(-) ${formatCurrency(advancePaid)}</td>
  //             </tr>
  //             <tr class="balance-row">
  //               <td>Balance Paid (${paymentMethod.toUpperCase()}):</td>
  //               <td class="text-right">${formatCurrency(balanceDue)}</td>
  //             </tr>
  //             `
  //                 : ""
  //             }
  //           </table>
  //         </div>

  //         <div class="footer">
  //           <p class="thank-you">Thank you for choosing ${
  //             settings?.data?.general?.name || "Vrindavan Palace"
  //           }!</p>
  //           <p>We hope you enjoyed your stay and look forward to welcoming you again.</p>
  //           <p style="margin-top: 15px; font-size: 11px;">This is a computer-generated invoice and does not require a signature.</p>
  //         </div>
  //       </div>
  //     </body>
  //     </html>
  //   `;
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Checkout - Room {booking.room_number}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Bill Summary</TabsTrigger>
            <TabsTrigger value="services">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add Services ({additionalServices.length})
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
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
              <div className="font-semibold mb-2">Room Charges</div>
              <div className="flex justify-between">
                <span>
                  Room {booking.room_number} ({nights} ×{" "}
                  {formatCurrency(booking.room_rate)})
                </span>
                <span>{formatCurrency(roomCharges)}</span>
              </div>

              {additionalServices.length > 0 && (
                <>
                  <div className="font-semibold mt-4 mb-2">
                    Additional Services
                  </div>
                  {additionalServices.map((service, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
                          {service.category}
                        </span>
                        {service.description} ({service.quantity} ×{" "}
                        {formatCurrency(service.unit_price)})
                      </span>
                      <span>{formatCurrency(service.total_price)}</span>
                    </div>
                  ))}
                </>
              )}

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>CGST ({gstRates.cgst}%)</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>SGST ({gstRates.sgst}%)</span>
                <span>{formatCurrency(sgst)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>

              {advancePaid > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Advance Paid</span>
                  <span>- {formatCurrency(advancePaid)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-xl text-primary">
                <span>Balance Due</span>
                <span>{formatCurrency(balanceDue)}</span>
              </div>
            </div>

            {/* Payment Method */}
            {balanceDue > 0 && (
              <div>
                <Label className="mb-2">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="net_banking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          {/* Add Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-3">Add Additional Service</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Service Description</Label>
                  <Input
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g., Breakfast, Laundry, etc."
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) =>
                      setNewService({ ...newService, category: value })
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="service">Room Service</SelectItem>
                      <SelectItem value="minibar">Mini Bar</SelectItem>
                      <SelectItem value="laundry">Laundry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newService.quantity}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Unit Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newService.unit_price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        unit_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    onClick={handleAddService}
                    className="w-full hotel-button-gold"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </div>
            </div>

            {/* Added Services List */}
            {additionalServices.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-semibold">Added Services</h3>
                {additionalServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-background capitalize font-medium">
                          {service.category}
                        </span>
                        <span className="font-medium">
                          {service.description}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.quantity} ×{" "}
                        {formatCurrency(service.unit_price)} ={" "}
                        <span className="font-semibold">
                          {formatCurrency(service.total_price)}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveService(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t font-semibold">
                  <span>Services Total:</span>
                  <span>{formatCurrency(servicesTotal)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No additional services added</p>
                <p className="text-sm">
                  Add services to include them in the invoice
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4 border-t">
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
                Complete & Print Invoice
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
