// src/pages/client/checkout/checkout.types.ts

export type CheckoutPaymentMethod = "COD" | "VNPAY"; 
// future: | "MOMO"

export interface BuyNowItem {
  product: any;
  quantity: number;
}

export type CheckoutInitState =
  | {
      mode: "CART";
      cart_id: string;
      item_ids: string[];
    }
  | {
      mode: "ORDER";
      order_id: string;
    }
  | {
      buyNowItem: BuyNowItem;
    };

export interface CheckoutSubmitPayload {
  cart_id: string;
  address_id: string;
  item_ids: string[];
  payment_method: CheckoutPaymentMethod;
}

export interface BuyNowSubmitPayload {
  product_id: string;
  quantity: number;
  address_id: string;
  payment_method: CheckoutPaymentMethod;
}