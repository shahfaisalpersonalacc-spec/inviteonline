"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch((e) => {
        if (e.status === 401) setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // any request answered 401 (expired or replaced session) logs out here too
  useEffect(() => {
    const expired = () => setUser(null);
    window.addEventListener("auth:expired", expired);
    return () => window.removeEventListener("auth:expired", expired);
  }, []);

  const handleSession = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback((email, password) => api("/auth/login", { method: "POST", body: { email, password }, auth: false }).then(handleSession), [handleSession]);
  // Doesn't log in: resolves to { needsVerification, email } and the code is entered via verifyEmail.
  const register = useCallback((name, email, password) => api("/auth/register", { method: "POST", body: { name, email, password }, auth: false }), []);
  const verifyEmail = useCallback((email, code) => api("/auth/verify-email", { method: "POST", body: { email, code }, auth: false }).then(handleSession), [handleSession]);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, verifyEmail, logout, handleSession }),
    [user, loading, login, register, verifyEmail, logout, handleSession]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
