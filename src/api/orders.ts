// src/api/orders.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";
import type { Payment } from "./payments";

// ==============================
// Interfaces
// ==============================

export type PaymentMethod = "COD" | "MOMO" | "VNPAY" | "CREDIT_CARD";
export type OrderStatus = "PENDING" | "COMPLETED" | "INACTIVE";

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  total_amount: number;
  status: OrderStatus;

  placed_at?: string | null;
  paid_at?: string | null;

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;

  cancel_reason?: string | null;

  items?: OrderItem[];
  payment?: Payment | null;
}

export interface OrderListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface OrderListResult {
  data: Order[];
  meta: OrderListMeta;
}

export interface OrderListParams {
  page?: number;
  pageSize?: number;
  q?: string;

  status?: OrderStatus;
  user_id?: string;

  sortBy?: string;
  sortDir?: "ASC" | "DESC";

  showDeleted?: "active" | "deleted" | "all";
}

export interface CreateManualOrderPayload {
  user_id: string;
  address_id: string;
  payment_method?: PaymentMethod;
  items: Array<{
    product_id: string;
    quantity: number;
    price?: number | null;
  }>;
}

export interface CreateOrderFromCartPayload {
  cart_id: string;
  address_id: string;
  item_ids: string[];
  payment_method?: PaymentMethod;
}

export interface BuyNowPayload {
  address_id: string;
  product_id: string;
  quantity: number;
  payment_method?: PaymentMethod;
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  address_id?: string;
}

// =====================================
// Base CRUD
// =====================================
const base = createCrudApi("orders");

// =====================================
// orders API (CRUD + custom endpoints)
// =====================================
export const orderApi = {
  ...base,

  /**
   * GET /orders/:id/items
   */
  async listItems(orderId: string): Promise<{ items: OrderItem[] }> {
    const res = await axiosClient.get(`/orders/${orderId}/items`);
    return res.data;
  },

  /**
   * POST /orders/manual
   */
  async createManual(payload: CreateManualOrderPayload): Promise<Order> {
    const res = await axiosClient.post(`/orders/manual`, payload);
    return res.data;
  },

  /**
   * POST /orders/from-cart
   */
  async createFromCart(payload: CreateOrderFromCartPayload): Promise<Order> {
    const res = await axiosClient.post(`/orders/from-cart`, payload);
    return res.data.data;
  },

  /**
   * POST /orders/buy-now
   */
  async buyNow(payload: BuyNowPayload): Promise<Order> {
    const res = await axiosClient.post(`/orders/buy-now`, payload);
    return res.data;
  },

  /**
   * POST /orders/:id/cancel
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const res = await axiosClient.post(`/orders/${id}/cancel`, { reason });
    return res.data;
  },

  /**
   * Admin update status/address
   * PUT /orders/:id
   */
  async updateOrder(id: string, data: UpdateOrderPayload): Promise<Order> {
    const res = await axiosClient.put(`/orders/${id}`, data);
    return res.data;
  },
};

export default orderApi;
