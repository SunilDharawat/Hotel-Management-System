import api from "./axios";

export const settingsAPI = {
  getAll: async () => {
    return await api.get("/settings");
  },

  getList: async () => {
    return await api.get("/settings/list");
  },

  getByKey: async (key) => {
    return await api.get(`/settings/${key}`);
  },

  update: async (key, value) => {
    return await api.put(`/settings/${key}`, { value });
  },

  updateMultiple: async (updates) => {
    return await api.put("/settings", updates);
  },

  create: async (data) => {
    return await api.post("/settings", data);
  },

  delete: async (key) => {
    return await api.delete(`/settings/${key}`);
  },

  resetToDefaults: async () => {
    return await api.post("/settings/reset");
  },

  getPublicInfo: async () => {
    return await api.get("/settings/public/general");
  },
};
