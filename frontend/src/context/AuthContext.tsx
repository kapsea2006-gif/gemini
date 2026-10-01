"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "student" | "company" | "admin";
  avatar_url?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  token: string | null;
  role: "student" | "company" | "admin" | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: "student" | "company" | "admin") => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "register";
  setAuthModalMode: (mode: "login" | "register") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.warn("Failed to fetch user session:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      await refreshUser();
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: any) => {
    setLoading(true);
    try {
      const data = await api.register(formData);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      await refreshUser();
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (targetRole: "student" | "company" | "admin") => {
    setLoading(true);
    try {
      const data = await api.demoLogin(targetRole);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      await refreshUser();
    } catch (err: any) {
      console.error("Demo login error:", err);
      alert(err.message || "Failed to switch demo account. Is backend running with seed data?");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
