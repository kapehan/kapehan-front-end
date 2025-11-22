// src/context/AuthContext.js
"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser as fetchCurrentUser, logoutUser as apiLogout } from "../utils/auth-utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // optional, for showing a spinner

  // Fetch current user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login helper
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout helper
  const logout = async () => {
    await apiLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
