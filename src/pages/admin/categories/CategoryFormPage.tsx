// src/pages/admin/categories/CategoryFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { categoryConfig } from "./category.config";
import { categoryApi } from "@/api/categories";

export default function CategoryFormPage() {
  return <CrudFormPage config={categoryConfig} api={categoryApi} />;
}
