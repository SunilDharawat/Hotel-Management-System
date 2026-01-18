import api from "./axios";

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.success && response.data.token) {
sessionStorage.setItem("auth_token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  },

  register: async (userData) => {
    return await api.post("/auth/register", userData);
  },

  getProfile: async () => {
    return await api.get("/auth/profile");
  },

  updateProfile: async (data) => {
    return await api.put("/auth/profile", data);
  },

  changePassword: async (data) => {
    return await api.post("/auth/change-password", data);
  },

  logout: () => {
sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
  },
};
