// src/api/categories.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ===============================
// 🔹 Interfaces 
// ===============================
export interface Category {
  id: string;
  name: string;
  description: string | null;
  product_count?: number | string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface CategoryListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface CategoryListResult {
  data: Category[];
  meta: CategoryListMeta;
}

export interface CategoryListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

// =======================================
// Base CRUD Implementation from template
// =======================================
const baseApi = createCrudApi("categories");

// =======================================
// Final API = base CRUD + custom actions
// =======================================
export const categoryApi = {
  ...baseApi,

  // Custom business actions (giữ nguyên)
  async addProducts(
    categoryId: string,
    productIds: string[]
  ): Promise<{ updatedCount: number }> {
    const res = await axiosClient.post(`/categories/${categoryId}/products`, {
      product_ids: productIds,
    });
    return res.data;
  },

  async removeProducts(
    categoryId: string,
    productIds: string[]
  ): Promise<{ removedCount: number }> {
    const res = await axiosClient.delete(`/categories/${categoryId}/products`, {
      data: { product_ids: productIds },
    });
    return res.data;
  },
};

export default categoryApi;
