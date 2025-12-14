// src/pages/admin/carts/CartFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { cartConfig } from "./cart.config";
import { cartApi } from "@/api/cart";

export default function CartFormPage() {
  return <CrudFormPage config={cartConfig} api={cartApi} />;
}
