// src/pages/admin/products/ProductListPage.tsx

import CrudListPage from "@/components/crud/CrudListPage";
import { productConfig } from "./product.config";
import { productApi } from "@/api/products";
import ProductTable from "./components/ProductTable";

export default function ProductListPage() {
  return (
    <CrudListPage
      config={productConfig}
      api={productApi}
      TableComponent={ProductTable}
    />
  );
}
