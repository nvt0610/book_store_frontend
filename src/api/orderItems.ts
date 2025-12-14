// src/api/orderItems.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ==============================
// Interfaces
// ==============================

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface OrderItemListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface OrderItemListResult {
  data: OrderItem[];
  meta: OrderItemListMeta;
}

export interface OrderItemListParams {
  page?: number;
  pageSize?: number;

  order_id?: string;
  product_id?: string;

  sortBy?: string;
  sortDir?: "ASC" | "DESC";

  showDeleted?: "active" | "deleted" | "all";
}

export interface CreateOrderItemPayload {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderItemPayload {
  quantity?: number;
  price?: number;
}

// =====================================
// Base CRUD
// =====================================
const base = createCrudApi("order-items");

// =====================================
// API Order Items
// =====================================
export const orderItemApi = {
  ...base,

  /**
   * Override create with proper typing
   */
  async create(data: CreateOrderItemPayload): Promise<OrderItem> {
    const res = await axiosClient.post(`/order-items`, data);
    return res.data;
  },

  /**
   * Override update with proper typing
   */
  async update(id: string, data: UpdateOrderItemPayload): Promise<OrderItem> {
    const res = await axiosClient.put(`/order-items/${id}`, data);
    return res.data;
  },
};

export default orderItemApi;
