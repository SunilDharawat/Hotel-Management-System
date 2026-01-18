import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { notificationsAPI } from "@/api/notifications";
import { toast } from "sonner";

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Refs to track active requests and prevent race conditions
  const abortControllerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const FETCH_COOLDOWN = 1000; // 1 second cooldown between requests

  // Check authentication state and set up polling
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem("auth_token");
      const newAuthState = !!token;
      setIsAuthenticated(newAuthState);

      if (newAuthState) {
        // Start polling only if authenticated
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            fetchUnreadCount();
          }, 30000);
        }
        // Fetch initial data
        fetchUnreadCount();
      } else {
        // Stop polling if not authenticated
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Clear notification data
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    // Check auth immediately
    checkAuth();

    // Listen for storage changes (logout/login in other tabs)
    const handleStorageChange = (e) => {
      // Note: sessionStorage doesn't trigger storage events across tabs
      // So we'll remove this listener since sessionStorage is tab-isolated
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Cancel any pending request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array - run only once on mount

  // Separate effect for dropdown open/close to refresh notifications
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchNotifications = async (params = {}) => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    const now = Date.now();

    // Prevent rapid successive requests
    if (now - lastFetchTimeRef.current < FETCH_COOLDOWN) {
      console.log("NotificationContext: Request too soon, skipping...");
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) {
      console.log(
        "NotificationContext: Already fetching notifications, skipping...",
      );
      return;
    }

    try {
      console.log("NotificationContext: Fetching notifications...");
      lastFetchTimeRef.current = now;
      isFetchingRef.current = true;
      setIsLoading(true);
      abortControllerRef.current = new AbortController();

      const response = await notificationsAPI.getAll(params);
      console.log("NotificationContext: Notifications response:", response);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch notifications:", error);
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const fetchUnreadCount = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const markAsRead = async (id) => {
    // Don't proceed if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      await notificationsAPI.markAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif,
        ),
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    // Don't proceed if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      await notificationsAPI.markAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true })),
      );

      // Update unread count
      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (id) => {
    // Don't proceed if not authenticated
    if (!isAuthenticated) {
      console.log(
        "NotificationContext: Not authenticated, skipping delete notification...",
      );
      return;
    }

    try {
      await notificationsAPI.delete(id);

      // Update local state
      const deletedNotif = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));

      // Update unread count if it was unread
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.is_read) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    toggleDropdown,
    closeDropdown,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
