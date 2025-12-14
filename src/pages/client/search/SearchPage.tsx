import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Stack, Skeleton, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { productApi } from "@/api/products";
import { unwrapList, unwrapMeta } from "@/utils/unwrap";

import ProductCard from "@/components/product/ProductCard";
import SearchHeader from "./components/SearchHeader";
import SearchEmpty from "./components/SearchEmpty";
import { searchApi } from "@/api/search";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  // =========================
  // URL PARAMS
  // =========================
  const q = params.get("q") || "";
  const authorId = params.get("author_id");
  const publisherId = params.get("publisher_id");

  const page = Number(params.get("page") || 1);
  const pageSize = 12;

  const sortBy = params.get("sortBy") || undefined;
  const sortDir = params.get("sortDir") as "ASC" | "DESC" | null;

  // =========================
  // STATE
  // =========================
  const [products, setProducts] = useState<any[] | null>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [suggestAuthor, setSuggestAuthor] = useState<any | null>(null);
  const [suggestPublisher, setSuggestPublisher] = useState<any | null>(null);

  const authorName = useMemo(() => {
    if (!authorId || !products || products.length === 0) return null;
    return products[0]?.author_name || null;
  }, [authorId, products]);

  const publisherName = useMemo(() => {
    if (!publisherId || !products || products.length === 0) return null;
    return products[0]?.publisher_name || null;
  }, [publisherId, products]);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const res = await productApi.list({
          q: q || undefined,
          author_id: authorId || undefined,
          publisher_id: publisherId || undefined,
          page,
          pageSize,

          // default sort: "relevance" → created_at DESC
          sortBy: sortBy || "created_at",
          sortDir: sortDir || "DESC",
        });

        if (!mounted) return;

        setProducts(unwrapList(res));
        setMeta(unwrapMeta(res));
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [q, authorId, publisherId, page, sortBy, sortDir]);

  // =========================
  // AUTO-DETECT AUTHOR / PUBLISHER FROM q
  // =========================
  useEffect(() => {
    // chỉ detect khi:
    // - có q
    // - chưa filter author / publisher
    if (!q || authorId || publisherId) {
      setSuggestAuthor(null);
      setSuggestPublisher(null);
      return;
    }

    let mounted = true;

    searchApi.search(q).then((res) => {
      if (!mounted) return;

      if (res?.authors?.length === 1) {
        setSuggestAuthor(res.authors[0]);
      } else {
        setSuggestAuthor(null);
      }

      if (res?.publishers?.length === 1) {
        setSuggestPublisher(res.publishers[0]);
      } else {
        setSuggestPublisher(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [q, authorId, publisherId]);

  // =========================
  // HANDLERS
  // =========================
  const updateParams = (next: Record<string, any>) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") p.delete(k);
      else p.set(k, String(v));
    });
    p.delete("page"); // reset page on change
    setParams(p);
  };

  const handleClearAuthor = () => updateParams({ author_id: null });

  const handleClearPublisher = () => updateParams({ publisher_id: null });

  const handlePageChange = (_: any, value: number) => {
    const p = new URLSearchParams(params);
    p.set("page", String(value));
    setParams(p);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <Box>
      <SearchHeader
        keyword={q}
        total={meta?.total || 0}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={(v) =>
          updateParams({ sortBy: v.sortBy, sortDir: v.sortDir })
        }
      />

      {/* =====================
       * AUTO-DETECT SUGGESTION CHIPS
       * ===================== */}
      {(suggestAuthor || suggestPublisher) && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {suggestAuthor && (
            <Chip
              label={`Tác giả: ${suggestAuthor.name}`}
              variant="outlined"
              onClick={() =>
                updateParams({
                  q: null, // 👈 QUAN TRỌNG: clear q
                  author_id: suggestAuthor.id,
                })
              }
            />
          )}

          {suggestPublisher && (
            <Chip
              label={`NXB: ${suggestPublisher.name}`}
              variant="outlined"
              onClick={() =>
                updateParams({
                  q: null,
                  publisher_id: suggestPublisher.id,
                })
              }
            />
          )}
        </Stack>
      )}

      {/* =====================
       * FILTER CHIPS
       * ===================== */}
      {(authorId || publisherId) && (
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {authorId && (
            <Chip
              label={`Tác giả: ${authorName ?? "..."}`}
              color="primary"
              onDelete={handleClearAuthor}
            />
          )}

          {publisherId && (
            <Chip
              label={`NXB: ${publisherName ?? "..."}`}
              color="primary"
              onDelete={handleClearPublisher}
            />
          )}
        </Stack>
      )}

      {/* =====================
       * PRODUCTS GRID
       * ===================== */}
      {loading || products === null ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={420} />
          ))}
        </Box>
      ) : products.length === 0 ? (
        <SearchEmpty keyword={q} />
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Box>

          {meta?.totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                page={page}
                count={meta.totalPages}
                onChange={handlePageChange}
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
