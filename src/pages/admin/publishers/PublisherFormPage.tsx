// src/pages/admin/publishers/PublisherFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { publisherConfig } from "./publisher.config";
import { publisherApi } from "@/api/publishers";

export default function PublisherFormPage() {
  return <CrudFormPage config={publisherConfig} api={publisherApi} />;
}
