// src/pages/client/account/account.service.ts
import axiosClient from "@/api/axiosClient";
import { addressApi } from "@/api/addresses";
import type { AddressFormData } from "./account.types";

export const accountService = {
  async getMe() {
    const res = await axiosClient.get("/auth/me");
    return res.data.data;
  },

  async updateProfile(data: any) {
    const res = await axiosClient.put("/auth/me", data);
    return res.data.data;
  },

  // ADDRESS
  listAddresses() {
    return addressApi.list({ pageSize: 100 });
  },

  createAddress(data: AddressFormData) {
    return addressApi.create(data);
  },

  updateAddress(id: string, data: AddressFormData) {
    return addressApi.update(id, data);
  },

  deleteAddress(id: string) {
    return addressApi.remove(id);
  },

  setDefaultAddress(id: string) {
    return addressApi.setDefault(id);
  },
};
