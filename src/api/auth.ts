import axiosClient from "./axiosClient";
import { useAuthStore } from "@/store/authStore";
import { useLookupStore } from "@/store/lookupStore";
import { cartApi } from "@/api/cart";
import { useCartStore } from "@/store/cartStore";

export const authApi = {
  async login(email: string, password: string) {
    const res = await axiosClient.post("/auth/login", { email, password });

    const { accessToken, refreshToken, user } = res.data.data;

    useAuthStore.getState().setAuth({
      accessToken,
      refreshToken,
      user,
    });

    // 👇 MERGE GUEST CART
    const guestToken = localStorage.getItem("guest_token");
    if (guestToken) {
      try {
        await cartApi.mergeGuestToUser({ guest_token: guestToken });
        localStorage.removeItem("guest_token");
      } catch (e) {
        console.warn("Merge guest cart failed", e);
      }
    }

    // 👇 RELOAD CART SAU KHI AUTH + MERGE XONG
    await useCartStore.getState().loadCart();

    return user;
  },

  logout() {
    useAuthStore.getState().logout();
    useLookupStore.getState().clear();
  },
};
