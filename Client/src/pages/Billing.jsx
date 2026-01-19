import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import {
  Receipt,
  Eye,
  Printer,
  Download,
  Search,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { InvoiceViewModal } from "@/components/billing/InvoiceViewModal";
import { invoicesAPI } from "@/api/invoices";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Billing() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch invoices with filters
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: [
      "invoices",
      {
        search: searchQuery,
        payment_status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        limit,
      },
    ],
    queryFn: () =>
      invoicesAPI.getAll({
        search: searchQuery || undefined,
        payment_status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        limit,
      }),
  });

  // Fetch invoice statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["invoice-stats"],
    queryFn: () => invoicesAPI.getStats(),
  });

  const invoices = invoicesData?.data?.invoices || [];
  const pagination = invoicesData?.data?.pagination || {
    total: 0,
    page: 1,
    totalPages: 1,
  };
  const stats = statsData?.data || {};

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const handleDownloadPDF = async (invoice) => {
    try {
      toast.info("Generating PDF...");

      const blob = await invoicesAPI.downloadPDF(invoice.id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoice.invoice_number}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download invoice", {
        description: error.message,
      });
    }
  };

  const handleViewPDF = (invoice) => {
    try {
      const pdfUrl = invoicesAPI.getPDFUrl(invoice.id);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      toast.error("Failed to open invoice", {
        description: error.message,
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all";

  if (invoicesLoading || statsLoading) {
    return (
      <MainLayout title="Billing" subtitle="Manage invoices and GST billing">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading billing data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Billing" subtitle="Manage invoices and GST billing">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <p className="text-sm opacity-80">Total Revenue (30d)</p>
              <p className="text-2xl md:text-3xl font-bold mt-2">
                {formatCurrency(stats.total_amount)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl md:text-3xl font-bold mt-2 text-green-600">
                {formatCurrency(stats.total_paid)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Due</p>
              <p className="text-2xl md:text-3xl font-bold mt-2 text-red-600">
                {formatCurrency(stats.total_due)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl md:text-3xl font-bold mt-2">
                {stats.total_invoices}
              </p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-green-600">Paid: {stats.paid_count}</span>
                <span className="text-yellow-600">
                  Pending: {stats.pending_count}
                </span>
                <span className="text-orange-600">
                  Partial: {stats.partial_count}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number, customer name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Invoices</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleClearFilters}
                    title="Clear filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary">Search: {searchQuery}</Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary">Status: {statusFilter}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <div className="text-sm text-muted-foreground">
                Showing {invoices.length} of {pagination.total}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? "No invoices found matching your filters"
                    : "No invoices yet"}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-4"
                  >
                    {/* Left Side: Icon & Info */}
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="hidden xs:flex w-10 h-10 rounded-lg bg-primary/10 items-center justify-center shrink-0">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {invoice.customer_name}
                        </p>
                        {invoice.booking_number && (
                          <p className="text-xs text-muted-foreground">
                            Booking: {invoice.booking_number}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(
                            parseISO(invoice.created_at),
                            "dd MMM yyyy, hh:mm a",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Total & Status & Actions */}
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="sm:text-right">
                        <p className="font-bold text-lg sm:text-base">
                          {formatCurrency(invoice.grand_total)}
                        </p>
                        {invoice.payment_status === "paid" ? (
                          <p className="text-xs text-green-600">
                            ✓ Paid: {formatCurrency(invoice.amount_paid)}
                          </p>
                        ) : invoice.payment_status === "partial" ? (
                          <div className="text-xs">
                            <p className="text-green-600">
                              Paid: {formatCurrency(invoice.amount_paid)}
                            </p>
                            <p className="text-red-600">
                              Due: {formatCurrency(invoice.amount_due)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-red-600">
                            Due: {formatCurrency(invoice.amount_due)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            invoice.payment_status === "paid"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : invoice.payment_status === "partial"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                : invoice.payment_status === "refunded"
                                  ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                  : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                          }
                        >
                          {invoice.payment_status}
                        </Badge>

                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => setSelectedInvoice(invoice)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleViewPDF(invoice)}
                            title="View PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleDownloadPDF(invoice)}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedInvoice && (
        <InvoiceViewModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </MainLayout>
  );
}
