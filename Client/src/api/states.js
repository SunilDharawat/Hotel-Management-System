import api from "./axios";

export const statesAPI = {
  getAll: async () => {
    return await api.get("/states");
  },
};
