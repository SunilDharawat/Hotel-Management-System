import api from "./axios";

export const smsAPI = {
  // SMS Messages
  getAll: async (params = {}) => {
    return await api.get("/sms", { params });
  },

  getById: async (id) => {
    return await api.get(`/sms/${id}`);
  },

  send: async (data) => {
    return await api.post("/sms/send", data);
  },

  sendBulk: async (data) => {
    return await api.post("/sms/send-bulk", data);
  },

  getStats: async (params = {}) => {
    return await api.get("/sms/stats", { params });
  },

  getByCustomer: async (customerId, limit = 10) => {
    return await api.get(`/sms/customer/${customerId}`, { params: { limit } });
  },

  delete: async (id) => {
    return await api.delete(`/sms/${id}`);
  },
};

export const templatesAPI = {
  getAll: async (params = {}) => {
    return await api.get("/templates", { params });
  },

  getById: async (id) => {
    return await api.get(`/templates/${id}`);
  },

  getByType: async (type) => {
    return await api.get(`/templates/type/${type}`);
  },

  create: async (data) => {
    return await api.post("/templates", data);
  },

  update: async (id, data) => {
    return await api.put(`/templates/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/templates/${id}`);
  },

  preview: async (templateId, variables) => {
    return await api.post("/templates/preview", {
      template_id: templateId,
      variables,
    });
  },
};
