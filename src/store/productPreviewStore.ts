import { create } from "zustand";
import { productApi } from "@/api/products";
import type { Product } from "@/api/products";

interface ProductPreviewState {
  map: Record<string, Product>;
  loading: boolean;

  loadByIds: (ids: string[]) => Promise<void>;
  getById: (id: string) => Product | undefined;
  clear: () => void;
}

export const useProductPreviewStore = create<ProductPreviewState>(
  (set, get) => ({
    map: {},
    loading: false,

    async loadByIds(ids) {
      const uniqIds = Array.from(new Set(ids)).filter(Boolean);
      if (!uniqIds.length) return;

      // bỏ qua những id đã có
      const missing = uniqIds.filter((id) => !get().map[id]);
      if (!missing.length) return;

      set({ loading: true });
      try {
        const res = await productApi.list({
          pageSize: missing.length,
          filters: [
            {
              field: "id",
              op: "in",
              value: missing,
            },
          ],
        });

        // 👇 BẮT BUỘC unwrap đúng tầng
        const list = res.data?.data?.data ?? [];
        const newMap: Record<string, Product> = {};
        for (const p of list) {
          newMap[p.id] = p;
        }

        set((state) => ({
          map: { ...state.map, ...newMap },
        }));
      } finally {
        set({ loading: false });
      }
    },

    getById(id) {
      return get().map[id];
    },

    clear() {
      set({ map: {}, loading: false });
    },
  })
);
