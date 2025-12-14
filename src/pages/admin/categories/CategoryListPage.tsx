// src/pages/admin/categories/CategoryListPage.tsx
import CrudListPage from "@/components/crud/CrudListPage";
import { categoryConfig } from "./category.config";
import { categoryApi } from "@/api/categories";
import CategoryTable from "./components/CategoryTable";

export default function CategoryListPage() {
  return (
    <CrudListPage
      config={categoryConfig}
      api={categoryApi}
      TableComponent={CategoryTable}
    />
  );
}
