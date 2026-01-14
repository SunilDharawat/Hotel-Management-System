import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  Users,
  Receipt,
  MessageSquare,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Hotel,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BedDouble, label: "Rooms", path: "/rooms", permission: "rooms.view" },
  {
    icon: Calendar,
    label: "Bookings",
    path: "/bookings",
    permission: "bookings.view",
  },
  {
    icon: Users,
    label: "Customers",
    path: "/customers",
    permission: "customers.view",
  },
  {
    icon: Receipt,
    label: "Billing",
    path: "/billing",
    permission: "invoices.view",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages",
    permission: "messages.view",
  },
  { icon: UserCog, label: "Users", path: "/users", permission: "users.view" },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    permission: "settings.view",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg  flex items-center justify-center">
            <img src="/HMS_Logo.png" alt="Logo" className="w-10 h-10" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display text-lg font-bold text-sidebar-primary">
                Vrindavan
              </h1>
              <p className="text-xs text-sidebar-foreground/70">Palace Hotel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          const button = (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-primary",
                collapsed && "justify-center px-2"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon
                className={cn("h-5 w-5", isActive && "text-sidebar-primary")}
              />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-popover text-popover-foreground"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* User & Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {user && !collapsed && (
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {user.role}
            </p>
          </div>
        )}

        <div className={cn("flex gap-2", collapsed ? "flex-col" : "")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-popover text-popover-foreground"
            >
              Logout
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-popover text-popover-foreground"
            >
              {collapsed ? "Expand" : "Collapse"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
