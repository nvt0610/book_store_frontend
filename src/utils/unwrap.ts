// src/utils/unwrap.ts

// LIST: res.data.data.data

// export function unwrapList(res: any) {
//   return res?.data?.data?.data ?? []; 
// }

export function unwrapList(res: any) {
  if (Array.isArray(res?.data?.data?.data)) return res.data.data.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

// ITEM: res.data.data
export function unwrapItem(res: any) {
  return res?.data?.data ?? null;
}

// META: res.data.data.meta
export function unwrapMeta(res: any) {
  return res?.data?.data?.meta ?? {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };
}
