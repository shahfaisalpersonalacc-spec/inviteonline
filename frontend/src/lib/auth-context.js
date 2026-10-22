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

  const handleSession = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback((email, password) => api("/auth/login", { method: "POST", body: { email, password }, auth: false }).then(handleSession), [handleSession]);
  const register = useCallback((name, email, password) => api("/auth/register", { method: "POST", body: { name, email, password }, auth: false }).then(handleSession), [handleSession]);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, logout, handleSession }),
    [user, loading, login, register, logout, handleSession]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
