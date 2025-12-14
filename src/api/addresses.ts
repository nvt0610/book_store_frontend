// src/api/addresses.ts
import axiosClient from "./axiosClient";
import { createCrudApi } from "./crudApi";

// ==============================
// Interfaces
// ==============================

export interface Address {
  id: string;
  user_id: string;

  full_name: string;
  phone: string;

  address_line: string;
  address_line2?: string | null;

  postal_code?: string | null;
  is_default: boolean;

  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AddressListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
  limit: number;
}

export interface AddressListResult {
  data: Address[];
  meta: AddressListMeta;
}

export interface AddressListParams {
  page?: number;
  pageSize?: number;
  q?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
  showDeleted?: "active" | "deleted" | "all";
}

// ==============================
// Create / Update Payload
// ==============================

export interface CreateAddressPayload {
  full_name: string;
  phone: string;
  address_line: string;
  address_line2?: string | null;
  postal_code?: string | null;
  is_default?: boolean; // optional — BE tự set false
}

export interface UpdateAddressPayload {
  full_name?: string;
  phone?: string;
  address_line?: string;
  address_line2?: string | null;
  postal_code?: string | null;
  // is_default không cho update — dùng setDefault
}

// =====================================
// Base CRUD
// =====================================
const base = createCrudApi("addresses");

// =====================================
// API Addresses = base CRUD + custom API
// =====================================
export const addressApi = {
  ...base,

  /**
   * Set address as default
   * Backend: PATCH /addresses/:id/set-default
   */
  async setDefault(id: string): Promise<Address> {
    const res = await axiosClient.patch(`/addresses/${id}/set-default`);
    return res.data;
  },
};

export default addressApi;
