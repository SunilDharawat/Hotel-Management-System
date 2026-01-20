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
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { bookingsAPI } from "@/api/bookings";
// import { invoicesAPI } from "@/api/invoices";
// import { paymentsAPI } from "@/api/payments";
// import { settingsAPI } from "@/api/settings";
// import { toast } from "sonner";
// import { format, differenceInDays } from "date-fns";
// import {
//   Receipt,
//   Loader2,
//   Printer,
//   Plus,
//   Trash2,
//   ShoppingCart,
// } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export function CheckoutModal({ isOpen, onClose, booking }) {
//   const queryClient = useQueryClient();
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [activeTab, setActiveTab] = useState("summary");
//   console.log(booking, "b");

//   // Additional service charges
//   const [additionalServices, setAdditionalServices] = useState([]);
//   const [newService, setNewService] = useState({
//     description: "",
//     category: "food",
//     quantity: 1,
//     unit_price: 0,
//   });

//   // Fetch settings for GST rates
//   const { data: settings } = useQuery({
//     queryKey: ["settings"],
//     queryFn: settingsAPI.getAll,
//   });

//   const gstRates = settings?.data?.gst_rates || {};
//   const gstState = settings?.data?.hotel_state || {};

//   console.log(gstState, "g");

//   // Calculate room charges
//   const nights = differenceInDays(
//     new Date(booking.check_out_date),
//     new Date(booking.check_in_date),
//   );
//   const roomCharges = booking.room_rate * nights;

//   // Calculate additional services total
//   const servicesTotal = additionalServices.reduce(
//     (sum, service) => sum + service.quantity * service.unit_price,
//     0,
//   );

//   // Calculate totals
//   const subtotal = roomCharges + servicesTotal;
//   const cgst = subtotal * (gstRates.cgst / 100);
//   const sgst = subtotal * (gstRates.sgst / 100);
//   const igst = subtotal * (gstRates.igst / 100);
//   const totalTax = cgst + sgst;
//   const grandTotal = subtotal + totalTax;
//   const totalGst = cgst + sgst + igst;
//   const grandTotalWithGst = grandTotal + totalGst;
//   const advancePaid = booking.advance_payment || 0;
//   const balanceDue = grandTotal - advancePaid;

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const handleAddService = () => {
//     if (!newService.description || newService.unit_price <= 0) {
//       toast.error("Please enter service description and price");
//       return;
//     }

//     const service = {
//       ...newService,
//       total_price: newService.quantity * newService.unit_price,
//     };

//     setAdditionalServices([...additionalServices, service]);
//     setNewService({
//       description: "",
//       category: "food",
//       quantity: 1,
//       unit_price: 0,
//     });
//     toast.success("Service added");
//   };

//   const handleRemoveService = (index) => {
//     setAdditionalServices(additionalServices.filter((_, i) => i !== index));
//     toast.success("Service removed");
//   };

//   const handleCheckout = async () => {
//     try {
//       setIsProcessing(true);

//       // Step 1: Checkout the booking
//       await bookingsAPI.checkOut(booking.id);

//       // Step 2: Create invoice from booking with additional items
//       const invoiceResponse = await invoicesAPI.createFromBooking({
//         booking_id: booking.id,
//         additional_items: additionalServices,
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

//       // Download PDF from backend
//       await handleDownloadInvoice(invoice.id);

//       onClose();
//     } catch (error) {
//       toast.error("Checkout failed", {
//         description: error.message,
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleDownloadInvoice = async (invoiceId) => {
//     try {
//       toast.info("Generating invoice PDF...");

//       // Get PDF blob from backend
//       const blob = await invoicesAPI.downloadPDF(invoiceId);

//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `Invoice-${booking.booking_number}.pdf`;

//       // Trigger download
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast.success("Invoice downloaded successfully!");

//       // Option to view in new tab
//       if (window.confirm("Would you like to view the invoice in a new tab?")) {
//         const pdfUrl = invoicesAPI.getPDFUrl(invoiceId);
//         window.open(pdfUrl, "_blank");
//       }
//     } catch (error) {
//       toast.error("Failed to download invoice", {
//         description: error.message,
//       });
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl bg-background max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Receipt className="h-5 w-5" />
//             Checkout - Room {booking.room_number}
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="summary">Bill Summary</TabsTrigger>
//             <TabsTrigger value="services">
//               <ShoppingCart className="h-4 w-4 mr-2" />
//               Add Services ({additionalServices.length})
//             </TabsTrigger>
//           </TabsList>

//           {/* Summary Tab */}
//           <TabsContent value="summary" className="space-y-4">
//             {/* Guest Info */}
//             <div className="p-4 rounded-lg bg-muted">
//               <p className="font-semibold">{booking.customer_name}</p>
//               <p className="text-sm text-muted-foreground">
//                 {booking.customer_phone}
//               </p>
//             </div>

//             {/* Stay Details */}
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Check-in</span>
//                 <span>
//                   {format(new Date(booking.check_in_date), "MMM d, yyyy")}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Check-out</span>
//                 <span>
//                   {format(new Date(booking.check_out_date), "MMM d, yyyy")}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Duration</span>
//                 <span>
//                   {nights} night{nights > 1 ? "s" : ""}
//                 </span>
//               </div>
//             </div>

//             {/* Bill Summary */}
//             <div className="border-t pt-4 space-y-2 text-sm">
//               <div className="font-semibold mb-2">Room Charges</div>
//               <div className="flex justify-between">
//                 <span>
//                   Room {booking.room_number} ({nights} ×{" "}
//                   {formatCurrency(booking.room_rate)})
//                 </span>
//                 <span>{formatCurrency(roomCharges)}</span>
//               </div>
//               {additionalServices.length > 0 && (
//                 <>
//                   <div className="font-semibold mt-4 mb-2">
//                     Additional Services
//                   </div>
//                   {additionalServices.map((service, index) => (
//                     <div key={index} className="flex justify-between">
//                       <span className="flex items-center gap-2">
//                         <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
//                           {service.category}
//                         </span>
//                         {service.description} ({service.quantity} ×{" "}
//                         {formatCurrency(service.unit_price)})
//                       </span>
//                       <span>{formatCurrency(service.total_price)}</span>
//                     </div>
//                   ))}
//                 </>
//               )}
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-medium">
//                   <span>Subtotal</span>
//                   <span>{formatCurrency(subtotal)}</span>
//                 </div>
//               </div>
//               if(gstState.state_id === booking.customer_state_id)
//               {
//                 <>
//                   <div className="flex justify-between text-muted-foreground">
//                     <span>CGST ({gstRates.cgst}%)</span>
//                     <span>{formatCurrency(cgst)}</span>
//                   </div>
//                   <div className="flex justify-between text-muted-foreground">
//                     <span>SGST ({gstRates.sgst}%)</span>
//                     <span>{formatCurrency(sgst)}</span>
//                   </div>

//                   <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
//                     <span>Grand Total</span>
//                     <span>{formatCurrency(grandTotal)}</span>
//                   </div>
//                 </>
//               }
//               else
//               {
//                 <>
//                   <div className="flex justify-between text-muted-foreground">
//                     <span>CGST ({gstRates.cgst}%)</span>
//                     <span>{formatCurrency(cgst)}</span>
//                   </div>
//                   <div className="flex justify-between text-muted-foreground">
//                     <span>SGST ({gstRates.sgst}%)</span>
//                     <span>{formatCurrency(sgst)}</span>
//                   </div>
//                   <div className="flex justify-between text-muted-foreground">
//                     <span>IGST ({gstRates.igst}%)</span>
//                     <span>{formatCurrency(igst)}</span>
//                   </div>
//                   <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
//                     <span>Grand Total</span>
//                     <span>{formatCurrency(grandTotal)}</span>
//                   </div>
//                 </>
//               }
//               {advancePaid > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Advance Paid</span>
//                   <span>- {formatCurrency(advancePaid)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-xl text-primary">
//                 <span>Balance Due</span>
//                 <span>{formatCurrency(balanceDue)}</span>
//               </div>
//             </div>

//             {/* Payment Method */}
//             {balanceDue > 0 && (
//               <div>
//                 <Label className="mb-2">Payment Method</Label>
//                 <Select value={paymentMethod} onValueChange={setPaymentMethod}>
//                   <SelectTrigger className="bg-background">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-popover">
//                     <SelectItem value="cash">Cash</SelectItem>
//                     <SelectItem value="upi">UPI</SelectItem>
//                     <SelectItem value="credit_card">Credit Card</SelectItem>
//                     <SelectItem value="debit_card">Debit Card</SelectItem>
//                     <SelectItem value="net_banking">Net Banking</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//           </TabsContent>

//           {/* Add Services Tab */}
//           <TabsContent value="services" className="space-y-4">
//             <div className="p-4 bg-muted rounded-lg">
//               <h3 className="font-semibold mb-3">Add Additional Service</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="col-span-2">
//                   <Label>Service Description</Label>
//                   <Input
//                     value={newService.description}
//                     onChange={(e) =>
//                       setNewService({
//                         ...newService,
//                         description: e.target.value,
//                       })
//                     }
//                     placeholder="e.g., Breakfast, Laundry, etc."
//                   />
//                 </div>
//                 <div>
//                   <Label>Category</Label>
//                   <Select
//                     value={newService.category}
//                     onValueChange={(value) =>
//                       setNewService({ ...newService, category: value })
//                     }
//                   >
//                     <SelectTrigger className="bg-background">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-popover">
//                       <SelectItem value="food">Food & Beverage</SelectItem>
//                       <SelectItem value="service">Room Service</SelectItem>
//                       <SelectItem value="minibar">Mini Bar</SelectItem>
//                       <SelectItem value="laundry">Laundry</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Quantity</Label>
//                   <Input
//                     type="number"
//                     min="1"
//                     value={newService.quantity}
//                     onChange={(e) =>
//                       setNewService({
//                         ...newService,
//                         quantity: parseInt(e.target.value) || 1,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Label>Unit Price (₹)</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     value={newService.unit_price}
//                     onChange={(e) =>
//                       setNewService({
//                         ...newService,
//                         unit_price: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     placeholder="0.00"
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <Button
//                     onClick={handleAddService}
//                     className="w-full hotel-button-gold"
//                     type="button"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Service
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Added Services List */}
//             {additionalServices.length > 0 ? (
//               <div className="space-y-2">
//                 <h3 className="font-semibold">Added Services</h3>
//                 {additionalServices.map((service, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-muted rounded-lg"
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs px-2 py-1 rounded bg-background capitalize font-medium">
//                           {service.category}
//                         </span>
//                         <span className="font-medium">
//                           {service.description}
//                         </span>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {service.quantity} ×{" "}
//                         {formatCurrency(service.unit_price)} ={" "}
//                         <span className="font-semibold">
//                           {formatCurrency(service.total_price)}
//                         </span>
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleRemoveService(index)}
//                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//                 <div className="flex justify-between pt-3 border-t font-semibold">
//                   <span>Services Total:</span>
//                   <span>{formatCurrency(servicesTotal)}</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-muted-foreground">
//                 <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                 <p>No additional services added</p>
//                 <p className="text-sm">
//                   Add services to include them in the invoice
//                 </p>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>

//         <div className="flex gap-2 pt-4 border-t">
//           <Button
//             variant="outline"
//             onClick={onClose}
//             className="flex-1"
//             disabled={isProcessing}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCheckout}
//             className="flex-1 hotel-button-gold"
//             disabled={isProcessing}
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Printer className="h-4 w-4 mr-2" />
//                 Complete & Print Invoice
//               </>
//             )}
//           </Button>
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
  const gstState = settings?.data?.hotel_state || {};

  // Calculate room charges
  const nights = differenceInDays(
    new Date(booking.check_out_date),
    new Date(booking.check_in_date),
  );
  const roomCharges = booking.room_rate * nights;

  // Calculate additional services total
  const servicesTotal = additionalServices.reduce(
    (sum, service) => sum + service.quantity * service.unit_price,
    0,
  );

  // Calculate totals
  const subtotal = roomCharges + servicesTotal;

  // Determine if same state or different state
  const isSameState =
    String(gstState.state_id) === booking.customer_gst_state_code;

  // Calculate GST based on state matching
  const cgst = isSameState ? subtotal * (gstRates.cgst / 100) : 0;
  const sgst = isSameState ? subtotal * (gstRates.sgst / 100) : 0;
  const igst = !isSameState ? subtotal * (gstRates.igst / 100) : 0;

  // Calculate grand total
  const totalTax = isSameState ? cgst + sgst : igst;
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

              {/* GST Section - Conditional rendering based on state */}
              {isSameState ? (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>CGST ({gstRates.cgst}%)</span>
                    <span>{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>SGST ({gstRates.sgst}%)</span>
                    <span>{formatCurrency(sgst)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>IGST ({gstRates.igst}%)</span>
                    <span>{formatCurrency(igst)}</span>
                  </div>
                </>
              )}

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
