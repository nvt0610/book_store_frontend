// src/api/payments.ts
import axiosClient from "./axiosClient";

/* ================================
   Types
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
}

/* ================================
   Read-only Payment API
================================ */

export const paymentApi = {
  /** GET /payments */
  async list(params?: any): Promise<{ data: Payment[]; meta: any }> {
    const res = await axiosClient.get("/payments", { params });
    return res.data;
  },

  /** GET /payments/:id */
  async getById(id: string): Promise<Payment | null> {
    const res = await axiosClient.get(`/payments/${id}`);
    return res.data.data ?? null;
  },

  /** GET /payments/order/:order_id */
  async listByOrder(order_id: string): Promise<Payment[]> {
    const res = await axiosClient.get(`/payments/order/${order_id}`);
    return res.data.data;
  },

  // POST /order/:order_id/retry
  async retryPayment(
    order_id: string,
    payment_method: PaymentMethod
  ): Promise<Payment> {
    const res = await axiosClient.post(`/payments/order/${order_id}/retry`, {
      payment_method,
    });
    return res.data.data;
  },
};

export default paymentApi;
