import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/api/auth";
import { hasPermission as checkPermission } from "@/utils/permissions";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
const savedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("auth_token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
sessionStorage.removeItem("user");
        sessionStorage.removeItem("auth_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  const updateUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        hasPermission,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function useAuth() {
  const { user, login, logout, hasPermission, isLoading } = useApp();
  return {
    user,
    login,
    logout,
    hasPermission,
    isLoading,
    isAuthenticated: !!user,
  };
}
