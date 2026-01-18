// import "@fontsource/playfair-display/400.css";
// import "@fontsource/playfair-display/500.css";
// import "@fontsource/playfair-display/600.css";
// import "@fontsource/playfair-display/700.css";
// import "@fontsource/inter/300.css";
// import "@fontsource/inter/400.css";
// import "@fontsource/inter/500.css";
// import "@fontsource/inter/600.css";
// import "@fontsource/inter/700.css";

// // import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner, Toaster } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AppProvider } from "./contexts/App";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Rooms from "./pages/Rooms";
// import Customers from "./pages/Customers";
// import NewCustomer from "./pages/NewCustomer";
// import Bookings from "./pages/Bookings";
// import NewBooking from "./pages/NewBooking";
// import Billing from "./pages/Billing";
// import Messages from "./pages/Messages";
// import Users from "./pages/Users";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AppProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Navigate to="/login" replace />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/rooms" element={<Rooms />} />
//             <Route path="/customers" element={<Customers />} />
//             <Route path="/customers/new" element={<NewCustomer />} />
//             <Route path="/bookings" element={<Bookings />} />
//             <Route path="/bookings/new" element={<NewBooking />} />
//             <Route path="/billing" element={<Billing />} />
//             <Route path="/messages" element={<Messages />} />
//             <Route path="/users" element={<Users />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AppProvider>
//   </QueryClientProvider>
// );

// export default App;
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { PERMISSIONS } from "./utils/permissions";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Customers from "./pages/Customers";
import NewCustomer from "./pages/NewCustomer";
import Bookings from "./pages/Bookings";
import NewBooking from "./pages/NewBooking";
import Billing from "./pages/Billing";
import Messages from "./pages/Messages";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NewRoom from "./pages/NewRoom";
import Reports from "./pages/Reports";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rooms"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ROOMS}>
                  <Rooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/new"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_ROOM}>
                  <NewRoom />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_CUSTOMERS}>
                  <Customers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customers/new"
              element={
                <ProtectedRoute
                  requiredPermission={PERMISSIONS.CREATE_CUSTOMER}
                >
                  <NewCustomer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_BOOKINGS}>
                  <Bookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings/new"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_BOOKING}>
                  <NewBooking />
                </ProtectedRoute>
              }
            />

            <Route
              path="/billing"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_INVOICES}>
                  <Billing />
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_SETTINGS}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_REPORTS}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationProvider>
  </AppProvider>
  </QueryClientProvider>
);

export default App;
