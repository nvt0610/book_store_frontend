// src/pages/admin/authors/AuthorFormPage.tsx
import CrudFormPage from "@/components/crud/CrudFormPage";
import { authorConfig } from "./author.config";
import { authorApi } from "@/api/authors";

export default function AuthorFormPage() {
  return <CrudFormPage config={authorConfig} api={authorApi} />;
}
