// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/contexts/AppContext";
// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   LayoutDashboard,
//   BedDouble,
//   Calendar,
//   Users,
//   Receipt,
//   MessageSquare,
//   UserCog,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   Hotel,
// } from "lucide-react";

// const navItems = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
//   { icon: BedDouble, label: "Rooms", path: "/rooms", permission: "rooms.view" },
//   {
//     icon: Calendar,
//     label: "Bookings",
//     path: "/bookings",
//     permission: "bookings.view",
//   },
//   {
//     icon: Users,
//     label: "Customers",
//     path: "/customers",
//     permission: "customers.view",
//   },
//   {
//     icon: Receipt,
//     label: "Billing",
//     path: "/billing",
//     permission: "invoices.view",
//   },
//   {
//     icon: MessageSquare,
//     label: "Messages",
//     path: "/messages",
//     permission: "messages.view",
//   },
//   { icon: UserCog, label: "Users", path: "/users", permission: "users.view" },
//   {
//     icon: Settings,
//     label: "Settings",
//     path: "/settings",
//     permission: "settings.view",
//   },
// ];

// export function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout, hasPermission } = useAuth();

//   const filteredNavItems = navItems.filter(
//     (item) => !item.permission || hasPermission(item.permission)
//   );

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div
//       className={cn(
//         "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
//         collapsed ? "w-20" : "w-64"
//       )}
//     >
//       {/* Logo */}
//       <div className="p-4 border-b border-sidebar-border">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-lg  flex items-center justify-center">
//             <img src="/HMS_Logo.png" alt="Logo" className="w-10 h-10" />
//           </div>
//           {!collapsed && (
//             <div className="animate-fade-in">
//               <h1 className="font-display text-lg font-bold text-sidebar-primary">
//                 Vrindavan
//               </h1>
//               <p className="text-xs text-sidebar-foreground/70">Palace Hotel</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         {filteredNavItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;

//           const button = (
//             <Button
//               key={item.path}
//               variant="ghost"
//               className={cn(
//                 "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
//                 isActive && "bg-sidebar-accent text-sidebar-primary",
//                 collapsed && "justify-center px-2"
//               )}
//               onClick={() => navigate(item.path)}
//             >
//               <Icon
//                 className={cn("h-5 w-5", isActive && "text-sidebar-primary")}
//               />
//               {!collapsed && <span>{item.label}</span>}
//             </Button>
//           );

//           if (collapsed) {
//             return (
//               <Tooltip key={item.path} delayDuration={0}>
//                 <TooltipTrigger asChild>{button}</TooltipTrigger>
//                 <TooltipContent
//                   side="right"
//                   className="bg-popover text-popover-foreground"
//                 >
//                   {item.label}
//                 </TooltipContent>
//               </Tooltip>
//             );
//           }

//           return button;
//         })}
//       </nav>

//       {/* User & Actions */}
//       <div className="p-3 border-t border-sidebar-border space-y-2">
//         {user && !collapsed && (
//           <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
//             <p className="font-medium text-sm">{user.name}</p>
//             <p className="text-xs text-sidebar-foreground/70 capitalize">
//               {user.role}
//             </p>
//           </div>
//         )}

//         <div className={cn("flex gap-2", collapsed ? "flex-col" : "")}>
//           <Tooltip delayDuration={0}>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-sidebar-foreground hover:bg-sidebar-accent"
//                 onClick={handleLogout}
//               >
//                 <LogOut className="h-5 w-5" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent
//               side="right"
//               className="bg-popover text-popover-foreground"
//             >
//               Logout
//             </TooltipContent>
//           </Tooltip>

//           <Tooltip delayDuration={0}>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
//                 onClick={() => setCollapsed(!collapsed)}
//               >
//                 {collapsed ? (
//                   <ChevronRight className="h-5 w-5" />
//                 ) : (
//                   <ChevronLeft className="h-5 w-5" />
//                 )}
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent
//               side="right"
//               className="bg-popover text-popover-foreground"
//             >
//               {collapsed ? "Expand" : "Collapse"}
//             </TooltipContent>
//           </Tooltip>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
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
  Menu,
  X,
  FileText,
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
    permission: "sms.view",
  },
{ icon: UserCog, label: "Users", path: "/users", permission: "users.view" },
  {
    icon: FileText,
    label: "Reports",
    path: "/reports",
    permission: "reports.view",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    permission: "settings.view",
  },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false); // Close mobile menu if resized to desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const filteredNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
          // Desktop collapse logic
          !isMobile && (collapsed ? "w-20" : "w-64"),
          // Mobile open/close logic
          isMobile && (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64")
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/HMS_Logo.png" alt="Logo" className="w-10 h-10" />
            {(!collapsed || isMobile) && (
              <div className="animate-fade-in">
                <h1 className="font-display text-lg font-bold text-sidebar-primary">
                  Vrindavan
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Palace Hotel
                </p>
              </div>
            )}
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isCollapsed = collapsed && !isMobile;

            const button = (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-primary",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => handleNavClick(item.path)}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive && "text-sidebar-primary"
                  )}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );

            return isCollapsed ? (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              button
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {user && (!collapsed || isMobile) && (
            <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user.role}
              </p>
            </div>
          )}

          <div
            className={cn(
              "flex gap-2",
              collapsed && !isMobile ? "flex-col" : ""
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>

            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
