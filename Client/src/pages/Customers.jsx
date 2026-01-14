import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Mail, Phone, User } from "lucide-react";
import { customersAPI } from "@/api/customers";
import { bookingsAPI } from "@/api/bookings";

export default function Customers() {
  const navigate = useNavigate();
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", { limit: 1 }],
    queryFn: () => customersAPI.getAll({ limit: 10 }),
    select: (response) => response.data.customers,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings", { limit: 5 }],
    queryFn: () => bookingsAPI.getAll({ limit: 5 }),
    select: (response) => response.data.bookings,
  });
  const [search, setSearch] = useState("");

  const filteredCustomers = customers?.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.contact_number.includes(search)
  );

  const getCustomerBookings = (customerId) =>
    bookings?.filter((b) => b.customer_id === customerId).length;

  const getCustomerRevenue = (customerId) =>
    bookings
      ?.filter((b) => b.customer_id === customerId)
      .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <MainLayout
      title="Customers"
      subtitle="Manage guest information and history"
    >
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                className="hotel-button-gold"
                onClick={() => navigate("/customers/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredCustomers?.map((customer) => (
            <Card
              key={customer.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {customer.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {customer.full_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.contact_number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {getCustomerBookings(customer.id)}
                      </p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {formatCurrency(getCustomerRevenue(customer.id))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Spent
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {customer.id_proof_type.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No customers found.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
