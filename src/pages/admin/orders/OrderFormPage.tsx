// src/pages/admin/orders/OrderFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { orderConfig } from "./order.config";
import { orderApi } from "@/api/orders";

export default function OrderFormPage() {
  return <CrudFormPage config={orderConfig} api={orderApi} />;
}
