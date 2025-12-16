// src/utils/unwrap.ts

// LIST: res.data.data.data

// export function unwrapList(res: any) {
//   return res?.data?.data?.data ?? [];
// }

export function unwrapList(res: any) {
  // Case 1: { data: { data: [] } }
  if (Array.isArray(res?.data?.data?.data)) {
    return res.data.data.data;
  }

  // Case 2: { data: [] }
  if (Array.isArray(res?.data?.data)) {
    return res.data.data;
  }

  // Case 3: { data: { items: [] } }  ⭐ NEW
  if (Array.isArray(res?.data?.data?.items)) {
    return res.data.data.items;
  }

  return [];
}

// ITEM: res.data.data
export function unwrapItem(res: any) {
  return res?.data?.data ?? null;
}

// META: res.data.data.meta
export function unwrapMeta(res: any) {
  return (
    res?.data?.data?.meta ?? {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    }
  );
}
