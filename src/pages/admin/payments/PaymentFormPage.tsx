// src/pages/admin/payments/PaymentFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { paymentConfig } from "./payment.config";
import { paymentApi } from "@/api/payments";

export default function PaymentFormPage() {
  return <CrudFormPage config={paymentConfig} api={paymentApi} />;
}
