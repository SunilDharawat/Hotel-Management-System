import api from "./axios";

export const bookingsAPI = {
  getAll: async (params = {}) => {
    return await api.get("/bookings", { params });
  },

  getById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  create: async (data) => {
    return await api.post("/bookings", data);
  },

  update: async (id, data) => {
    return await api.put(`/bookings/${id}`, data);
  },

  cancel: async (id, cancellation_reason) => {
    return await api.post(`/bookings/${id}/cancel`, { cancellation_reason });
  },

  checkIn: async (id) => {
    return await api.post(`/bookings/${id}/checkin`);
  },

  checkOut: async (id) => {
    return await api.post(`/bookings/${id}/checkout`);
  },

  getTodayArrivals: async () => {
    return await api.get("/bookings/today/arrivals");
  },

getTodayDepartures: async () => {
    return await api.get("/bookings/today/departures");
  },

  getActive: async () => {
    return await api.get("/bookings/active");
  },
};
