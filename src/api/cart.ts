// src/api/cart.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ===============================
// Cart Interfaces
// ===============================
export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface Cart {
  id: string;
  user_id?: string | null;
  guest_token?: string | null;
  status: "ACTIVE" | "INACTIVE";
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  items?: CartItem[];
}

export interface CartListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface CartListResult {
  data: Cart[];
  meta: CartListMeta;
}

export interface CartListParams {
  page?: number;
  pageSize?: number;

  q?: string;
  status?: string;
  user_id?: string;

  sortBy?: string;
  sortDir?: "ASC" | "DESC";

  showDeleted?: "active" | "deleted" | "all";
}

// ===============================
// Base CRUD API
// ===============================
const base = createCrudApi("carts");

// ===============================
// Custom APIs
// ===============================
export const cartApi = {
  ...base,

  /** GET /carts/me — user only */
  async getMyCart(): Promise<Cart> {
    const res = await axiosClient.get("/carts/me");
    return res.data?.data ?? res.data;
  },

  /** POST /carts/guest — public (guest cart) */
  async getOrCreateGuest(payload: { guest_token: string }): Promise<Cart> {
    const res = await axiosClient.post("/carts/guest", payload);
    return res.data?.data ?? res.data;
  },

  /** POST /carts/merge — merge guest → user */
  async mergeGuestToUser(payload: { guest_token: string }) {
    const res = await axiosClient.post("/carts/merge", payload);
    return res.data?.data ?? res.data;
  },
};

export default cartApi;
