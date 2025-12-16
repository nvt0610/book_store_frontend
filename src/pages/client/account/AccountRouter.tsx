import { Routes, Route } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import AccountPage from "./AccountPage";

import OrderListPage from "../orders/OrderListPage";
import OrderDetailPage from "../orders/OrderDetailPage";

export default function AccountRouter() {
  return (
    <Routes>
      <Route element={<AccountLayout />}>
        <Route index element={<AccountPage />} />

        <Route path="orders">
          <Route index element={<OrderListPage />} />
          <Route path=":id" element={<OrderDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
