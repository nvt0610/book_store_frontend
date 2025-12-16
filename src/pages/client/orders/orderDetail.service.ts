import orderApi from "@/api/orders";
import { productApi } from "@/api/products";
import type { OrderDetail, OrderDetailItem } from "./orderDetail.types";

async function getById(id: string): Promise<OrderDetail> {
  const res = await orderApi.getById(id);
  const raw = res.data?.data ?? res.data;

  if (!raw) {
    throw new Error("Order not found");
  }

  const items: OrderDetailItem[] = raw.items.map((it: any) => ({
    id: it.id,
    product_id: it.product.id,
    quantity: it.quantity,
    price: Number(it.price),
    product: it.product, // 👈 đã có sẵn
    subtotal: Number(it.price) * it.quantity,
  }));

  return {
    id: raw.id,
    status: raw.status,
    total_amount: Number(raw.total_amount),
    placed_at: raw.placed_at,
    paid_at: raw.paid_at,
    payment: raw.payment ?? null,
    items,
  };
}

export default {
  getById,
};
