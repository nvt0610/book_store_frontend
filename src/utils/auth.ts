// src/utils/auth.ts
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export const auth = {
  // ACCESS TOKEN
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  },
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // REFRESH TOKEN
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  },
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // USER
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);
      return data ?? null;
    } catch (err) {
      console.warn("⚠ USER JSON is invalid:", raw);
      // cleanup tránh crash lần sau
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  // CLEAR ALL
  clearAll() {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  },
};
