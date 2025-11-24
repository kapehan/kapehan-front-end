// src/context/AuthContext.js
"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser as fetchCurrentUser, logoutUser as apiLogout } from "../utils/auth-utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false); // added
  const [anonymousInfo, setAnonymousInfo] = useState(null); // added: keep anonymous payload if needed
  const [loading, setLoading] = useState(true);

  // helper to detect anonymous payload in various shapes
  const detectAnonymous = (payload) => {
    if (!payload) return false;
    const role = (payload.role || payload.data?.role || payload.user?.role || "").toString().toLowerCase();
    const maybeAnonMarker = payload?.role === undefined && payload?.id && payload?.username === "anonymous";
    return role === "anonymous" || maybeAnonMarker;
  };

  // Fetch current user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();

        const anon = detectAnonymous(currentUser);

        if (anon) {
          // keep anonymous payload for analytics/debug but treat as not authenticated
          setAnonymousInfo(currentUser);
          setUser(null);
          setIsAuthenticated(false);
          setIsAnonymous(true);
        } else {
          setAnonymousInfo(null);
          setUser(currentUser || null);
          setIsAuthenticated(!!currentUser);
          setIsAnonymous(false);
        }
      } catch (err) {
        setAnonymousInfo(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsAnonymous(false);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login helper
  const login = (userData) => {
    // Ignore anonymous payloads on login
    if (detectAnonymous(userData)) {
      setAnonymousInfo(userData);
      setUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(true);
      return;
    }
    setAnonymousInfo(null);
    setUser(userData);
    setIsAuthenticated(true);
    setIsAnonymous(false);
  };

  // Logout helper
  const logout = async () => {
    await apiLogout();
    setAnonymousInfo(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAnonymous(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAnonymous,          // added to context
      anonymousInfo,        // added to context
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
