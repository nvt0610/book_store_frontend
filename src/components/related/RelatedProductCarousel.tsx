import { Box, Skeleton, Typography } from "@mui/material";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  products: any[];
  loading?: boolean;
  maxItems?: number;
  itemWidth?: number;
}

export default function RelatedProductCarousel({
  products,
  productsMeta,
  loading = false,
  maxItems = 8,
  itemWidth = 220,
  onViewAll,
}: Props) {
  const list = products.slice(0, maxItems);
  const hasMore =
    productsMeta?.total != null && productsMeta.total > list.length;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 1,
        scrollSnapType: "x mandatory",
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "divider",
          borderRadius: 3,
        },
      }}
    >
      {loading ? (
        Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            sx={{
              width: itemWidth,
              height: 420,
              borderRadius: 2,
              flex: "0 0 auto",
            }}
          />
        ))
      ) : list.length > 0 ? (
        <>
          {list.map((p) => (
            <Box
              key={p.id}
              sx={{
                flex: "0 0 auto",
                width: itemWidth,
                scrollSnapAlign: "start",
              }}
            >
              <ProductCard product={p} />
            </Box>
          ))}

          {hasMore && onViewAll && (
            <Box
              sx={{
                flex: "0 0 auto",
                minWidth: itemWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={onViewAll}
            >
              <Typography color="primary">
                Xem tất cả ({productsMeta?.total})
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Typography color="text.secondary">Không có sản phẩm.</Typography>
      )}
    </Box>
  );
}
