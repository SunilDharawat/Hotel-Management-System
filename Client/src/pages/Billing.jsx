import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInvoices, useCustomers } from '@/contexts/AppContext';
import { Receipt, Eye, Printer } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { InvoiceViewModal } from '@/components/billing/InvoiceViewModal';

export default function Billing() {
  const { invoices } = useInvoices();
  const { customers } = useCustomers();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const getCustomer = (id) => customers.find(c => c.id === id);
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const totalRevenue = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalGst = invoices.reduce((sum, i) => sum + i.totalGst, 0);

  return (
    <MainLayout title="Billing" subtitle="Manage invoices and GST billing">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <p className="text-sm opacity-80">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total GST Collected</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalGst)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-3xl font-bold mt-2">{invoices.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map(invoice => {
                const customer = getCustomer(invoice.customerId);
                return (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">{customer?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{format(parseISO(invoice.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(invoice.grandTotal)}</p>
                        <p className="text-xs text-muted-foreground">GST: {formatCurrency(invoice.totalGst)}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">{invoice.paymentMethod.replace('_', ' ')}</Badge>
                      <Badge className={invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>{invoice.paymentStatus}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(invoice)}><Eye className="h-4 w-4 mr-1" />View</Button>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedInvoice(invoice); setTimeout(() => window.print(), 100); }}><Printer className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedInvoice && (
        <InvoiceViewModal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} invoice={selectedInvoice} />
      )}
    </MainLayout>
  );
}
