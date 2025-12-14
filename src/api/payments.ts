// src/api/payments.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

/* ================================
   Interfaces
================================ */

export type PaymentMethod = "COD" | "CREDIT_CARD" | "VNPAY" | "MOMO";
export type PaymentStatus = "PENDING" | "COMPLETED" | "INACTIVE";

export interface Payment {
  id: string;
  order_id: string;

  payment_method: PaymentMethod;
  amount: number;

  status: PaymentStatus;
  payment_ref: string | null;
  payment_date: string | null;

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface PaymentListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface PaymentListResult {
  data: Payment[];
  meta: PaymentListMeta;
}

export interface PaymentListParams {
  page?: number;
  pageSize?: number;
  q?: string;

  order_id?: string;
  payment_method?: PaymentMethod;
  status?: PaymentStatus;

  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

export interface CreatePaymentPayload {
  order_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_ref?: string | null;
  payment_date?: string | null;
  status?: PaymentStatus;
}

export interface UpdatePaymentPayload {
  payment_method?: PaymentMethod;
  amount?: number;
  payment_ref?: string | null;
  payment_date?: string | null;
  status?: PaymentStatus; // Cannot set COMPLETED (BE rule)
}

/* ================================
   Base CRUD
================================ */
const base = createCrudApi("payments");

/* ================================
   Custom API for Payments
================================ */
export const paymentApi = {
  ...base,

  /** GET /payments/order/:order_id */
  async listByOrder(order_id: string): Promise<Payment[]> {
    const res = await axiosClient.get(`/payments/order/${order_id}`);
    return res.data.data;
  },

  /** POST /payments/:order_id/complete */
  async markCompleted(order_id: string) {
    const res = await axiosClient.post(`/payments/order/${order_id}/complete`);
    return res.data.data;
  },

  /** POST /payments/:order_id/cancel */
  async cancelPending(order_id: string) {
    const res = await axiosClient.post(`/payments/order/${order_id}/cancel`);
    return res.data.data;
  },
};

export default paymentApi;
