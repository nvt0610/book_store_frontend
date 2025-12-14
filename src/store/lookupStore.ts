import { create } from "zustand";

const TTL_MS = 15 * 60 * 1000; // 15 phút

type EntityMap<T> = Record<string, T>;

interface LookupState {
  categories: EntityMap<any>;
  authors: EntityMap<any>;
  publishers: EntityMap<any>;

  loadedAt: number | null;
  loading: boolean;

  setCategories: (list: any[]) => void;
  setAuthors: (list: any[]) => void;
  setPublishers: (list: any[]) => void;

  markLoaded: () => void;
  isExpired: () => boolean;

  clear: () => void;
}

export const useLookupStore = create<LookupState>((set, get) => ({
  categories: {},
  authors: {},
  publishers: {},

  loadedAt: null,
  loading: false,

  setCategories: (list) =>
    set({
      categories: Object.fromEntries(list.map((x) => [x.id, x])),
    }),

  setAuthors: (list) =>
    set({
      authors: Object.fromEntries(list.map((x) => [x.id, x])),
    }),

  setPublishers: (list) =>
    set({
      publishers: Object.fromEntries(list.map((x) => [x.id, x])),
    }),

  markLoaded: () =>
    set({
      loadedAt: Date.now(),
      loading: false,
    }),

  isExpired: () => {
    const { loadedAt } = get();
    if (!loadedAt) return true;
    return Date.now() - loadedAt > TTL_MS;
  },

  clear: () =>
    set({
      categories: {},
      authors: {},
      publishers: {},
      loadedAt: null,
      loading: false,
    }),
}));
