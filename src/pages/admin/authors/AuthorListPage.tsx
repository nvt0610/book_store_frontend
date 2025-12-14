// src/pages/admin/categories/CategoryListPage.tsx
import CrudListPage from "@/components/crud/CrudListPage";
import { authorConfig } from "./author.config";
import { authorApi } from "@/api/authors";
import AuthorTable from "./components/AuthorTable";

export default function CategoryListPage() {
  return (
    <CrudListPage
      config={authorConfig}
      api={authorApi}
      TableComponent={AuthorTable}
    />
  );
}
