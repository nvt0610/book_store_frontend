// src/pages/admin/publishers/PublisherListPage.tsx
import CrudListPage from "@/components/crud/CrudListPage";
import { publisherConfig } from "./publisher.config";
import { publisherApi } from "@/api/publishers";
import PublisherTable from "./components/PublisherTable";

export default function PublisherListPage() {
  return (
    <CrudListPage
      config={publisherConfig}
      api={publisherApi}
      TableComponent={PublisherTable}
    />
  );
}
