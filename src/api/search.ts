// src/api/search.ts
import axiosClient from "./axiosClient";

export interface SearchResult {
  products: any[];
  authors: any[];
  publishers: any[];
}

export const searchApi = {
  async search(q: string): Promise<SearchResult> {
    const res = await axiosClient.get("/search", { params: { q } });
    return res.data.data; // chuẩn style responseHelper
  },
};

export default searchApi;
