// src/api/publishers.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ==============================
// Interfaces
// ==============================

export interface Publisher {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface PublisherListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface PublisherListResult {
  data: Publisher[];
  meta: PublisherListMeta;
}

export interface PublisherListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

export interface CreatePublisherPayload {
  name: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  logo_url?: string | null;
}

export interface UpdatePublisherPayload {
  name?: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  logo_url?: string | null;
}

// =====================================
// Base CRUD
// =====================================
const base = createCrudApi("publishers");

// =====================================
// API Publishers = base CRUD + custom
// =====================================
export const publisherApi = {
  ...base,

  /**
   * Update logo only
   * Backend: PUT /publishers/:id/logo
   */
  async updateLogo(id: string, logo_url: string | null): Promise<Publisher> {
    const res = await axiosClient.put(`/publishers/${id}/logo`, { logo_url });
    return res.data;
  },
};

export default publisherApi;
