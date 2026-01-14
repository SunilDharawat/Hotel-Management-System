import api from "./axios";

export const paymentsAPI = {
  getAll: async (params = {}) => {
    return await api.get("/payments", { params });
  },

  getById: async (id) => {
    return await api.get(`/payments/${id}`);
  },

  create: async (data) => {
    return await api.post("/payments", data);
  },

  getByInvoice: async (invoiceId) => {
    return await api.get(`/payments/invoice/${invoiceId}`);
  },

  getTodaysSummary: async () => {
    return await api.get("/payments/today/summary");
  },
};
