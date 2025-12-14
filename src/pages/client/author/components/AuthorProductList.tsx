// src/pages/client/author/components/AuthorProductList.tsx
import { Box, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

import { productApi } from "@/api/products";
import { unwrapList } from "@/utils/unwrap";
import ProductCard from "@/components/product/ProductCard";
import Section from "@/components/common/Section";

export default function AuthorProductList({ authorId, authorName }) {
  const [products, setProducts] = useState<any[] | null>(null);

  useEffect(() => {
    if (!authorId) return;

    productApi
      .list({ author_id: authorId, pageSize: 12 })
      .then((res) => setProducts(unwrapList(res)));
  }, [authorId]);

  return (
    <Section title={`Sách của ${authorName}`}>
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
        {!products
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={450} />
            ))
          : products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
      </Box>

      {products && products.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Chưa có sản phẩm nào
        </Typography>
      )}
    </Section>
  );
}
