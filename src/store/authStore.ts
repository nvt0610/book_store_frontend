// src/store/authStore.ts
import { create } from "zustand";
import { auth } from "@/utils/auth";

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;

  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: auth.getAccessToken(),
  refreshToken: auth.getRefreshToken(),
  user: auth.getUser(),

  setAuth: ({ accessToken, refreshToken, user }) => {
    auth.setAccessToken(accessToken);
    auth.setRefreshToken(refreshToken);
    auth.setUser(user);

    set({ accessToken, refreshToken, user });
  },

  logout: () => {
    auth.clearAll();
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
