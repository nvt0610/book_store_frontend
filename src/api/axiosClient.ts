import axios from "axios";
import { auth } from "@/utils/auth";
import { useAuthStore } from "@/store/authStore";
import { navigateTo } from "@/utils/navigation";
import { router } from "@/router";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR --------------------------------------------
axiosClient.interceptors.request.use((config) => {
  const token = auth.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE INTERCEPTOR -------------------------------------------
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const hasAuthHeader = Boolean(originalRequest?.headers?.Authorization);

    // Chỉ refresh nếu request ban đầu CÓ gửi access token
    if (
      error.response?.status === 401 &&
      hasAuthHeader &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = auth.getRefreshToken();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefresh, user } = res.data.data;

        useAuthStore.getState().setAuth({
          accessToken,
          refreshToken: newRefresh,
          user,
        });

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err);
        useAuthStore.getState().logout();
        router.navigate("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Không phải 401 do token → trả lỗi như bình thường
    return Promise.reject(error);
  }
);

export default axiosClient;
