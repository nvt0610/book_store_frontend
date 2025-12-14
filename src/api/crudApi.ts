// src/api/crudApi.ts
import axiosClient from "./axiosClient";

export function createCrudApi(resource: string) {
  return {
    list: (params: any = {}) =>
      axiosClient.get(`/${resource}`, { params }),

    getById: (id: string, params?: any) =>
      axiosClient.get(`/${resource}/${id}`, { params }),

    create: (data: any) =>
      axiosClient.post(`/${resource}`, data),

    update: (id: string, data: any) =>
      axiosClient.put(`/${resource}/${id}`, data),

    remove: (id: string) =>
      axiosClient.delete(`/${resource}/${id}`),
  };
}
