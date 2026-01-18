import api from "./axios";

export const notificationsAPI = {
  // Get all notifications for the user
  getAll: async (params = {}) => {
    return await api.get("/notifications", { params });
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    return await api.get("/notifications/unread-count");
  },

  // Get recent notifications for dashboard
  getRecent: async (limit = 5) => {
    return await api.get("/notifications/recent", { params: { limit } });
  },

  // Mark notification as read
  markAsRead: async (id) => {
    return await api.put(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await api.put("/notifications/mark-all-read");
  },

  // Delete notification
  delete: async (id) => {
    return await api.delete(`/notifications/${id}`);
  },
};