// src/pages/client/checkout/checkout.service.ts

import orderApi from "@/api/orders";
import type {
  CheckoutSubmitPayload,
  CheckoutPaymentMethod,
  BuyNowSubmitPayload,
} from "./checkout.types";

const checkoutService = {
  async checkoutFromCart(payload: CheckoutSubmitPayload) {
    // 1. Create order (+ payment PENDING ở backend)
    const order = await orderApi.createFromCart({
      cart_id: payload.cart_id,
      address_id: payload.address_id,
      item_ids: payload.item_ids,
      payment_method: payload.payment_method,
    });

    // ✅ CHỈ TRẢ ORDER
    return order;
  },

  async buyNow(payload: BuyNowSubmitPayload) {
    return orderApi.buyNow({
      address_id: payload.address_id,
      product_id: payload.product_id,
      quantity: payload.quantity,
      payment_method: payload.payment_method,
    });
  },

  async buyAgainFromOrder(payload: {
    source_order_id: string;
    address_id: string;
    payment_method: CheckoutPaymentMethod;
  }) {
    return orderApi.buyAgain(payload);
  },
};

export default checkoutService;
