import api from "./axios";

export const usersAPI = {
  getAll: async (params = {}) => {
    return await api.get("/users", { params });
  },

  getById: async (id) => {
    return await api.get(`/users/${id}`);
  },

  create: async (data) => {
    return await api.post("/users", data);
  },

  update: async (id, data) => {
    return await api.put(`/users/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/users/${id}`);
  },

  resetPassword: async (id, newPassword) => {
    return await api.post(`/users/${id}/reset-password`, { newPassword });
  },
};
