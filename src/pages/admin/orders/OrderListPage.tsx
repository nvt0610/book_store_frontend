// src/pages/admin/orders/OrderListPage.tsx
import CrudListPage from "@/components/crud/CrudListPage";
import { orderConfig } from "./order.config";
import orderApi from "@/api/orders";
import OrderTable from "./components/OrderTable";

export default function OrderListPage() {
  return (
    <CrudListPage
      config={orderConfig}
      api={orderApi}
      TableComponent={OrderTable}
    />
  );
}
