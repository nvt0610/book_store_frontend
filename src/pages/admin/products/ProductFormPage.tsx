// src/pages/admin/products/ProductFormPage.tsx

import CrudFormPage from "@/components/crud/CrudFormPage";
import { productConfig } from "./product.config";
import { productApi } from "@/api/products";

export default function ProductFormPage() {
  return <CrudFormPage config={productConfig} api={productApi} />;
}
