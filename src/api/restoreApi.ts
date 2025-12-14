import axiosClient from "./axiosClient";

export const restoreApi = {
  restore(table: string, id: string) {
    return axiosClient.post("/restore", { table, id });
  }
};
