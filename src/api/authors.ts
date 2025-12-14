// src/api/authors.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ==============================
// Interfaces
// ==============================

export interface Author {
  id: string;
  name: string;
  biography: string | null;
  photo_url: string | null;

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AuthorListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface AuthorListResult {
  data: Author[];
  meta: AuthorListMeta;
}

export interface AuthorListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

export interface CreateAuthorPayload {
  name: string;
  biography?: string;
  photo_url?: string | null;
}

export interface UpdateAuthorPayload {
  name?: string;
  biography?: string;
  photo_url?: string | null;
}

// =====================================
// Base CRUD
// =====================================
const base = createCrudApi("authors");

// =====================================
// API Authors = base CRUD + custom API
// =====================================
export const authorApi = {
  ...base,

  /**
   * Update only the photo_url
   * Backend: PUT /authors/:id/photo
   */
  async updatePhoto(id: string, photo_url: string | null): Promise<Author> {
    const res = await axiosClient.put(`/authors/${id}/photo`, { photo_url });
    return res.data;
  },
};

export default authorApi;
