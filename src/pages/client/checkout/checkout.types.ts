// src/pages/client/checkout/checkout.types.ts

export type CheckoutPaymentMethod = "COD" | "VNPAY"; 
// future: | "MOMO"

export interface CheckoutInitState {
  cart_id: string;
  item_ids: string[];
}

export interface CheckoutSubmitPayload {
  cart_id: string;
  address_id: string;
  item_ids: string[];
  payment_method: CheckoutPaymentMethod;
}
