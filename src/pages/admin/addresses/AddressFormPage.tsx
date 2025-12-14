// src/pages/admin/addresses/AddressFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { addressConfig } from "./address.config";
import { addressApi } from "@/api/addresses";

export default function AddressFormPage() {
  return <CrudFormPage config={addressConfig} api={addressApi} />;
}
