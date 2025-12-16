import type { Payment } from "@/api/payments";
import type { Product } from "@/api/products";

export interface OrderItemProductSnapshot {
  id: string;
  name: string;
  main_image: string | null;
  price: number | string;
}

export interface OrderDetailItem {
  id: string;
  quantity: number;
  price: number | string;

  product: OrderItemProductSnapshot;
  subtotal: number;
}

export interface OrderDetail {
  id: string;
  status: "PENDING" | "COMPLETED" | "INACTIVE";

  total_amount: number | string;
  placed_at?: string | null;
  paid_at?: string | null;
  cancel_reason?: string | null;

  items: OrderDetailItem[];
  payment?: Payment | null;
}
