import { useEffect, useState } from "react";
import { Box, Stack, Chip, Skeleton } from "@mui/material";

import { productApi } from "@/api/products";
import { unwrapList } from "@/utils/unwrap";

import Section from "@/components/common/Section";
import ProductCard from "@/components/product/ProductCard";
import RelatedProductCarousel from "@/components/related/RelatedProductCarousel";
import { useLookupStore } from "@/store/lookupStore";

export default function HomePage() {
  // =====================
  // LOOKUP (✅ đúng chỗ)
  // =====================
  const categoriesMap = useLookupStore((s) => s.categories);
  const categories = Object.values(categoriesMap);

  // =====================
  // STATE
  // =====================
  const [newArrivals, setNewArrivals] = useState<any[] | null>(null);
  const [bestSellers, setBestSellers] = useState<any[] | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // =====================
  // LOADERS (products only)
  // =====================
  useEffect(() => {
    productApi
      .list({ page: 1, pageSize: 8, sortBy: "created_at", sortDir: "DESC" })
      .then((res) => setNewArrivals(unwrapList(res)));

    productApi
      .list({ page: 1, pageSize: 8, sortBy: "updated_at", sortDir: "DESC" })
      .then((res) => setBestSellers(unwrapList(res)));
  }, []);

  // =====================
  // CATEGORY HANDLER
  // =====================
  const handleSelectCategory = async (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
      setCategoryProducts(null);
      return;
    }

    setSelectedCategory(catId);
    setLoadingProducts(true);

    try {
      const res = await productApi.list({
        page: 1,
        pageSize: 8,
        category_id: catId,
        sortBy: "created_at",
        sortDir: "DESC",
      });

      setCategoryProducts(unwrapList(res));
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <Box>
      {/* =====================
       * CATEGORIES
       * ===================== */}
      <Section title="Danh mục nổi bật">
        <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
          {!categories.length ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={100} height={36} />
            ))
          ) : (
            <>
              <Chip
                label="Tất cả"
                clickable
                color={!selectedCategory ? "primary" : "default"}
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryProducts(null);
                }}
              />

              {categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  clickable
                  color={selectedCategory === cat.id ? "primary" : "default"}
                  variant={
                    selectedCategory === cat.id ? "filled" : "outlined"
                  }
                  onClick={() => handleSelectCategory(cat.id)}
                />
              ))}
            </>
          )}
        </Stack>
      </Section>

      {/* =====================
       * CATEGORY PRODUCTS
       * ===================== */}
      {selectedCategory && (
        <Section title="Sách theo danh mục">
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
            {loadingProducts || !categoryProducts
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={450} />
                ))
              : categoryProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </Box>
        </Section>
      )}

      {/* =====================
       * HOME CAROUSELS
       * ===================== */}
      {!selectedCategory && (
        <>
          <Section title="Sách mới phát hành">
            <RelatedProductCarousel
              products={newArrivals || []}
              loading={!newArrivals}
              maxItems={8}
            />
          </Section>

          <Section title="Sách bán chạy">
            <RelatedProductCarousel
              products={bestSellers || []}
              loading={!bestSellers}
              maxItems={8}
            />
          </Section>
        </>
      )}
    </Box>
  );
}
