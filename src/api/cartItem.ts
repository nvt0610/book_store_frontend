// src/api/cartItem.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ===============================
// Interfaces
// ===============================
export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface CartItemListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CartItemListResult {
  data: CartItem[];
  meta: CartItemListMeta;
}

// ===============================
// Base CRUD (ADMIN ONLY)
// ===============================
const base = createCrudApi("cart-items");

// ===============================
// Custom endpoints
// ===============================
export const cartItemApi = {
  ...base,

  /** POST /cart-items — guest + user + admin */
  async addItem(payload: {
    cart_id: string;
    product_id: string;
    quantity: number;
    guest_token?: string;
  }) {
    const res = await axiosClient.post(`/cart-items`, payload);
    return res.data?.data ?? res.data;
  },

  /** PATCH /cart-items/:itemId — update quantity */
  async updateQuantity(itemId: string, quantity: number) {
    const res = await axiosClient.put(`/cart-items/${itemId}`, { quantity });
    return res.data?.data ?? res.data;
  },

  /** DELETE /cart-items/:itemId — remove item */
  async removeItem(itemId: string) {
    const res = await axiosClient.delete(`/cart-items/${itemId}`);
    return res.data?.data ?? res.data;
  },

  /** DELETE /cart-items?cart_id=xxx — clear entire cart */
  async clear(cart_id: string) {
    const res = await axiosClient.delete(`/cart-items`, {
      params: { cart_id },
    });
    return res.data?.data ?? res.data;
  },

  /** GET /cart-items/:itemId (admin) */
  async getItemById(itemId: string) {
    const res = await axiosClient.get(`/cart-items/${itemId}`);
    return res.data?.data ?? res.data;
  },
};

export default cartItemApi;
