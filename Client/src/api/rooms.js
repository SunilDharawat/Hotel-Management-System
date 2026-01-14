import api from "./axios";

export const roomsAPI = {
  getAll: async (params = {}) => {
    let rooms = await api.get("/rooms", { params });
    return rooms;
  },

  getById: async (id) => {
    return await api.get(`/rooms/${id}`);
  },

  create: async (data) => {
    return await api.post("/rooms", data);
  },

  update: async (id, data) => {
    return await api.put(`/rooms/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/rooms/${id}`);
  },

  checkAvailability: async (params) => {
    return await api.get("/rooms/availability", { params });
  },

  updateStatus: async (id, status) => {
    return await api.patch(`/rooms/${id}/status`, { status });
  },

  updateHousekeeping: async (id, housekeeping_status) => {
    return await api.patch(`/rooms/${id}/housekeeping`, {
      housekeeping_status,
    });
  },
};
