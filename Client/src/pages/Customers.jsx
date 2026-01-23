// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { MainLayout } from "@/components/layout/MainLayout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { useQuery } from "@tanstack/react-query";
// import { Search, Plus, Mail, Phone, User, DockIcon } from "lucide-react";
// import { customersAPI } from "@/api/customers";

// export default function Customers() {
//   const navigate = useNavigate();
//   const { data: customers, isLoading: customersLoading } = useQuery({
//     queryKey: ["customers"],
//     queryFn: () => customersAPI.getAll(),
//     select: (response) => response.data.customers,
//   });

//   const [search, setSearch] = useState("");

//   const filteredCustomers = customers?.filter(
//     (c) =>
//       c.full_name.toLowerCase().includes(search.toLowerCase()) ||
//       c.email.toLowerCase().includes(search.toLowerCase()) ||
//       c.contact_number.includes(search),
//   );

//   const formatCurrency = (value) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);

//   return (
//     <MainLayout
//       title="Customers"
//       subtitle="Manage guest information and history"
//     >
//       <div className="space-y-6 animate-fade-in">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col md:flex-row gap-4 items-center">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search customers..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-9"
//                 />
//               </div>
//               <Button
//                 className="hotel-button-gold"
//                 onClick={() => navigate("/customers/new")}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Customer
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid gap-4">
//           {filteredCustomers?.map((customer) => (
//             <Card
//               key={customer.id}
//               className="hover:shadow-md transition-shadow"
//             >
//               <CardContent className="p-4">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex flex-wrap items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                       <span className="font-semibold text-primary">
//                         {customer.full_name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </span>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-lg">
//                         {customer.full_name}
//                       </h3>
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                         <span className="flex items-center gap-1">
//                           <Mail className="h-3 w-3" />
//                           {customer.email}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Phone className="h-3 w-3" />
//                           {customer.contact_number}
//                         </span>
//                         <Badge variant="outline" className="capitalize">
//                           {customer.id_proof_type.replace("_", " ")}
//                         </Badge>
//                         <span className="flex items-center gap-1">
//                           <DockIcon className="h-3 w-3" />
//                           {customer.id_proof_number}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-6">
//                     <div className="text-center">
//                       <p className="text-2xl font-bold">
//                         {/* {getCustomerBookings(customer.id)} */}
//                         {customer.booking_count}
//                       </p>
//                       <p className="text-xs text-muted-foreground">Bookings</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-2xl font-bold">
//                         {formatCurrency(customer.total_spent)}
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         Total Spent
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {filteredCustomers?.length === 0 && (
//           <div className="text-center py-12 text-muted-foreground">
//             <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
//             <p>No customers found.</p>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Mail,
  Phone,
  User,
  DockIcon,
  Loader2,
} from "lucide-react";
import { customersAPI } from "@/api/customers";

export default function Customers() {
  const navigate = useNavigate();

  // Pagination and Search State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch customers with pagination and search
  const { data: response, isLoading: customersLoading } = useQuery({
    queryKey: ["customers", { search, page, limit }],
    queryFn: () => customersAPI.getAll({ search, page, limit }),
    // Use keepPreviousData: true if your version of TanStack query supports it
    // to prevent flickering during page changes
  });

  const customers = response?.data?.customers || [];
  const pagination = response?.data?.pagination || {
    total: 0,
    page: 1,
    totalPages: 1,
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  // Handle Loading State
  if (customersLoading) {
    return (
      <MainLayout
        title="Customers"
        subtitle="Manage guest information and history"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Customers"
      subtitle="Manage guest information and history"
    >
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset to page 1 on search
                  }}
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
          {customers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No customers found.</p>
            </div>
          ) : (
            <>
              {customers.map((customer) => (
                <Card
                  key={customer.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {customer.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {customer.full_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.contact_number}
                            </span>
                            <Badge
                              variant="outline"
                              className="capitalize text-[10px] h-5"
                            >
                              {customer.id_proof_type?.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                        <div className="text-center">
                          <p className="text-xl font-bold">
                            {customer.booking_count || 0}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Bookings
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(customer.total_spent)}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Total Spent
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-2 pt-4 border-t">
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
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
