// src/api/users.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ==============================
// Interfaces
// ==============================

export interface User {
  id: string;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  role: "ADMIN" | "CUSTOMER" | "GUEST";
  status: "ACTIVE" | "INACTIVE";
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface UserListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface UserListResult {
  data: User[];
  meta: UserListMeta;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  role: "ADMIN" | "CUSTOMER" | "GUEST";
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: "ADMIN" | "CUSTOMER" | "GUEST";
  status?: "ACTIVE" | "INACTIVE";
  password?: string;
}

// =====================================
// Sử dụng CRUD Template cho cơ bản
// =====================================
const base = createCrudApi("users");

// =====================================
// API Users = base CRUD + custom API
// =====================================
export const userApi = {
  ...base,

  // custom business logic
  async updateStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<User> {
    const res = await axiosClient.patch(`/users/${id}/status`, { status });
    return res.data;
  },
};

export default userApi;
