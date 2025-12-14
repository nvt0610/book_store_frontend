// src/pages/admin/carts/CartListPage.tsx
import CrudListPage from "@/components/crud/CrudListPage";
import { cartConfig } from "./cart.config";
import { cartApi } from "@/api/cart";
import CartTable from "./components/CartTable";

export default function CartListPage() {
  return (
    <CrudListPage
      config={cartConfig}
      api={cartApi}
      TableComponent={CartTable}
    />
  );
}
