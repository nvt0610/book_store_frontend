import axiosClient from "./axiosClient";

export interface CreateVnpayPayload {
  order_id: string;
}

export interface CreateVnpayResult {
  order_id: string;
  payment_id: string;
  paymentUrl: string;
  expiresAt: string;
}

export const vnpayApi = {
  async createPaymentUrl(payload: CreateVnpayPayload): Promise<CreateVnpayResult> {
    const res = await axiosClient.post("/vnpay/create", payload);
    return res.data.data;
  },
};

export default vnpayApi;
