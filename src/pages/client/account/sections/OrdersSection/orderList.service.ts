import { orderApi } from "@/api/orders";
import { unwrapList, unwrapMeta } from "@/utils/unwrap";

export async function fetchMyOrders(params?: {
  page?: number;
  pageSize?: number;
}) {
  const res = await orderApi.list({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    sortBy: "created_at",
    sortDir: "DESC",
  });

  return {
    data: unwrapList(res),
    meta: unwrapMeta(res),
  };
}
