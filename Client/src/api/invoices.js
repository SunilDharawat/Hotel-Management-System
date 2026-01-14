import api from "./axios";

export const invoicesAPI = {
  getAll: async (params = {}) => {
    return await api.get("/invoices", { params });
  },

  getById: async (id) => {
    return await api.get(`/invoices/${id}`);
  },

  createFromBooking: async (data) => {
    return await api.post("/invoices/from-booking", data);
  },

  createManual: async (data) => {
    return await api.post("/invoices/manual", data);
  },

  getPending: async () => {
    return await api.get("/invoices/pending");
  },

  getStats: async () => {
    return await api.get("/invoices/stats");
  },
};
