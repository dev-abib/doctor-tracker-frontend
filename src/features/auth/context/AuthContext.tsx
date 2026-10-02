"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/api";
import { authApi, LoginCredentials } from "../api/authApi";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      setUser(data.user);
      if (typeof document !== "undefined") {
        if (data.accessToken) {
          document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600; SameSite=Lax`;
        }
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
        }
        if (data.token) {
          document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
        }
      }
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      if (typeof document !== "undefined") {
        document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      }
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        updateUser,
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
