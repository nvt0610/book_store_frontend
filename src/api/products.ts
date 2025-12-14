// src/api/products.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ==============================
// Interfaces
// ==============================

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  stock: number;
  main_image: string | null;
  extra_images: string[] | null;

  category_id: string | null;
  publisher_id: string;
  author_id: string;

  status: "ACTIVE" | "INACTIVE";

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface ProductListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface ProductListResult {
  data: Product[];
  meta: ProductListMeta;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock?: number;

  main_image?: string | null;
  extra_images?: string[];

  category_id?: string | null;
  publisher_id: string;
  author_id: string;

  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;

  price?: number;
  stock?: number;

  main_image?: string | null;
  extra_images?: string[]; // FE gửi [] để clear

  category_id?: string | null;
  publisher_id?: string;
  author_id?: string;

  status?: "ACTIVE" | "INACTIVE";
}

// =====================================
// Base CRUD (list, getById, create, update, remove)
// =====================================
const base = createCrudApi("products");

// =====================================
// API Products = base CRUD + custom API
// =====================================
export const productApi = {
  ...base,

  /**
   * Update product status (ACTIVE / INACTIVE)
   * Backend: PATCH /products/:id/status
   */
  async updateStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<Product> {
    const res = await axiosClient.patch(`/products/${id}/status`, { status });
    return res.data;
  },

  /**
   * Replace extra images fully
   * Backend: PUT /products/:id/images
   */
  async updateImages(
    id: string,
    data: { main_image?: string | null; extra_images?: string[] }
  ): Promise<Product> {
    const res = await axiosClient.put(`/products/${id}/images`, data);
    return res.data;
  },
};

export default productApi;
