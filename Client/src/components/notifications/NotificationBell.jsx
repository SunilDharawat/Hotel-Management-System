import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Users,
  Home,
  CreditCard,
  FileText,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Notification type icons and colors
const notificationConfig = {
  success: {
    icon: Check,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  error: {
    icon: X,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
};

// Entity type icons
const entityIcons = {
  booking: Calendar,
  room: Home,
  payment: CreditCard,
  invoice: FileText,
  user: Users,
  system: AlertTriangle,
};

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    toggleDropdown,
    closeDropdown,
  } = useNotifications();

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const handleMarkAsRead = async (id, event) => {
    event.stopPropagation();
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async (event) => {
    event.stopPropagation();
    await markAllAsRead();
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    await deleteNotification(id);
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const getEntityIcon = (entityType) => {
    const IconComponent = entityIcons[entityType] || Info;
    return <IconComponent className="h-3 w-3" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={toggleDropdown}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-muted transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-96 p-0" sideOffset={8}>
          {/* Header */}
          <DropdownMenuLabel className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs h-8 px-2"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </DropdownMenuLabel>

          {/* Notifications List */}
          <div className="max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="p-2">
                  {notifications.map((notification) => {
                    const config =
                      notificationConfig[notification.type] ||
                      notificationConfig.info;
                    const IconComponent = config.icon;
                    const EntityIcon = getEntityIcon(notification.entity_type);

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer",
                          !notification.is_read && config.bgColor,
                          !notification.is_read && config.borderColor,
                        )}
                      >
                        {/* Notification Icon */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            !notification.is_read ? config.bgColor : "bg-muted",
                          )}
                        >
                          <IconComponent
                            className={cn(
                              "h-4 w-4",
                              !notification.is_read
                                ? config.color
                                : "text-muted-foreground",
                            )}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={cn(
                                  "text-sm font-medium line-clamp-2",
                                  !notification.is_read
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {notification.entity_type && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    {EntityIcon}
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatNotificationTime(
                                    notification.created_at,
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) =>
                                    handleMarkAsRead(notification.id, e)
                                  }
                                  className="h-6 w-6 p-0"
                                  title="Mark as read"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) =>
                                  handleDelete(notification.id, e)
                                }
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                title="Delete notification"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.is_read && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => {
                  // Navigate to full notifications page (if implemented)
                  closeDropdown();
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
