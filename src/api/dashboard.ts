// src/api/dashboard.ts
import axiosClient from "./axiosClient";

export interface LatestOrder {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface LatestUser {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface DashboardSummary {
  total_users: number;
  total_products: number;
  total_orders: number;
  revenue_this_month: number;
  latest_orders: LatestOrder[];
  latest_users: LatestUser[];
}

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await axiosClient.get("/admin/dashboard/summary");
    return res.data.data;
  },
};

export default dashboardApi;
