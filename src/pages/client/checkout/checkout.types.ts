// src/pages/client/checkout/checkout.types.ts

export type CheckoutPaymentMethod = "COD" | "VNPAY"; 
// future: | "MOMO"

export type CheckoutInitState =
  | {
      mode: "CART";
      cart_id: string;
      item_ids: string[];
    }
  | {
      mode: "ORDER";
      order_id: string;
    };

export interface CheckoutSubmitPayload {
  cart_id: string;
  address_id: string;
  item_ids: string[];
  payment_method: CheckoutPaymentMethod;
}