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
    const toLower = (v) => (v ?? "").toString().toLowerCase();

    const roles = [
      payload.role,
      payload.data?.role,
      payload.user?.role,
      payload.userType,
    ].map(toLower);

    const usernames = [
      payload.username,
      payload.data?.username,
      payload.user?.username,
    ].map(toLower);

    const flags = [
      payload.isAnonymous,
      payload.data?.isAnonymous,
      payload.user?.isAnonymous,
    ];

    const maybeAnonMarker =
      (payload?.role === undefined || payload?.role === null) &&
      (payload?.id || payload?.data?.id || payload?.user?.id) &&
      usernames.some((u) => u === "anonymous" || u === "guest");

    return (
      roles.some((r) => r === "anonymous" || r === "anon" || r === "guest") ||
      usernames.some((u) => u === "anonymous" || u === "guest") ||
      flags.some((f) => f === true) ||
      maybeAnonMarker
    );
  };

  // Validate if payload represents a fully authenticated user
  const isValidAuthenticatedUser = (payload) => {
    if (!payload) return false;
    if (detectAnonymous(payload)) return false;

    const id = payload?.data?.id || payload?.user?.id || payload?.id;
    const username = payload?.data?.username || payload?.user?.username || payload?.username;
    const authFlag =
      payload?.authenticated === true ||
      payload?.data?.authenticated === true ||
      payload?.user?.authenticated === true;

    // Accept if authenticated flag, or id+username (no longer require email)
    return Boolean(authFlag || (id && username));
  };

  // Fetch current user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();

        const anon = detectAnonymous(currentUser);
        const valid = isValidAuthenticatedUser(currentUser);

        if (anon || !valid) {
          // keep anonymous payload for analytics/debug but treat as not authenticated
          setAnonymousInfo(currentUser);
          setUser(null);
          setIsAuthenticated(false);
          setIsAnonymous(anon);
        } else {
          setAnonymousInfo(null);
          setUser(currentUser || null);
          setIsAuthenticated(true);
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
    const anon = detectAnonymous(userData);
    const valid = isValidAuthenticatedUser(userData);

    if (anon || !valid) {
      setAnonymousInfo(userData);
      setUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(anon);
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
