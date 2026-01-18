import { useAuth } from "@/contexts/AppContext";
import AdminDashboard from "./dashboard/AdminDashboard";
import ManagerDashboard from "./dashboard/ManagerDashboard";
import ReceptionistDashboard from "./dashboard/ReceptionistDashboard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  // Render role-specific dashboard
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "receptionist":
      return <ReceptionistDashboard />;
    default:
      // Fallback to receptionist dashboard for unknown roles
      return <ReceptionistDashboard />;
  }
}