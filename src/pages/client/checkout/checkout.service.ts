// src/pages/client/checkout/checkout.service.ts

import { orderApi } from "@/api/orders";
import type { CheckoutSubmitPayload } from "./checkout.types";

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
};

export default checkoutService;
