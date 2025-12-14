import { useEffect, useState } from "react";
import { useLookupStore } from "@/store/lookupStore";

import { categoryApi } from "@/api/categories";
import { authorApi } from "@/api/authors";
import { publisherApi } from "@/api/publishers";

type EntityType = "category" | "author" | "publisher";

export function useLookupEntity(type: EntityType, id?: string | null) {
  const store = useLookupStore();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const map =
      type === "category"
        ? store.categories
        : type === "author"
        ? store.authors
        : store.publishers;

    if (map[id]) {
      setData(map[id]);
      return;
    }

    // fallback call
    let api;
    if (type === "category") api = categoryApi;
    if (type === "author") api = authorApi;
    if (type === "publisher") api = publisherApi;

    if (!api) return;

    setLoading(true);
    api
      .getById(id)
      .then((res: any) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}
