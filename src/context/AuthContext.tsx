"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import { loginApi, signupApi } from "@/api/auth";

const MAIN_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9090/api/v1";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; username: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => { },
  signup: async () => { },
  logout: () => { },
  refreshProfile: async () => { },
});

/** Normalize a raw user object from the backend to the frontend UserProfile shape */
const normalizeUser = (raw: any): UserProfile => ({
  id: raw._id || raw.id || "",
  _id: raw._id || raw.id || "",
  email: raw.email || "",
  username: raw.name || raw.username || raw.email || "User",
  name: raw.name || raw.username || "",
  level: raw.level || "Beginner",
  xp: raw.xp || 0,
  streak: raw.streak || 0,
  avatar: raw.avatar || "",
  role: raw.role || "user",
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("codemind-user");
    if (!token || !storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      const userId = parsed.id || parsed._id;
      if (!userId) return;

      const res = await fetch(`${MAIN_API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(normalizeUser(data));
      }
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("codemind-user");
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("codemind-user");
      }
    }

    refreshProfile();
  }, [refreshProfile]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("codemind-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("codemind-user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi(email, password);
      const { token, user: rawUser } = res.data;
      localStorage.setItem("token", token);
      const normalized = normalizeUser(rawUser);
      setUser(normalized);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const signup = async (data: { email: string; password: string; username: string }) => {
    try {
      const res = await signupApi(data);
      const { token, user: rawUser } = res.data;
      localStorage.setItem("token", token);
      const normalized = normalizeUser(rawUser);
      setUser(normalized);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("codemind-user");
    setUser(null);
  };

  const isAuthenticated = !!(
    typeof window !== "undefined" && localStorage.getItem("token")
  );

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};