import api from "./axios";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

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
  downloadPDF: async (id) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}/download`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download PDF");
    }

    const blob = await response.blob();
    return blob;
  },

  getPDFUrl: (id) => {
    const token = sessionStorage.getItem("auth_token");
    return `${API_BASE_URL}/invoices/${id}/pdf?token=${token}`;
  },
};
