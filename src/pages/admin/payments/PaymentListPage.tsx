// src/pages/admin/payments/PaymentListPage.tsx
import CrudListPage from "@/components/crud/CrudListPage";
import { paymentConfig } from "./payment.config";
import { paymentApi } from "@/api/payments";
import PaymentTable from "./components/PaymentTable";

export default function PaymentListPage() {
  return (
    <CrudListPage
      config={paymentConfig}
      api={paymentApi}
      TableComponent={PaymentTable}
    />
  );
}
