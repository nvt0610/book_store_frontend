import { Stack, Typography, Chip } from "@mui/material";
import { formatCurrency } from "@/utils/currency";

export default function ProductInfo({ product }: { product: any }) {
  if (!product) return null;

  return (
    <Stack spacing={1}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {product.name}
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {formatCurrency(product.price)}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Chip
          label={product.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
          color={product.status === "ACTIVE" ? "success" : "default"}
          size="small"
        />
        <Chip
          label={`Tồn kho: ${product.stock ?? 0}`}
          size="small"
          variant="outlined"
        />
      </Stack>
    </Stack>
  );
}
