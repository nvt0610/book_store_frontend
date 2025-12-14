// src/pages/client/publisher/components/PublisherProductList.tsx
import { Box, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

import { productApi } from "@/api/products";
import { unwrapList } from "@/utils/unwrap";
import ProductCard from "@/components/product/ProductCard";
import Section from "@/components/common/Section";

export default function PublisherProductList({ publisherId, publisherName }) {
  const [products, setProducts] = useState<any[] | null>(null);

  useEffect(() => {
    if (!publisherId) return;

    productApi
      .list({ publisher_id: publisherId, pageSize: 12 })
      .then((res) => setProducts(unwrapList(res)));
  }, [publisherId]);

  return (
    <Section title={`Sách của ${publisherName}`}>
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
