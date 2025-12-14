// src/pages/client/checkout/components/CheckoutCartReview.tsx
import { Box, Button, Divider, Stack, Typography, Avatar } from "@mui/material";
import type { CartItemView } from "@/store/cartStore";
import { getThumb } from "@/utils/image";
import { formatCurrency } from "@/utils/currency";

export default function CheckoutCartReview({
  loading,
  items,
  itemCount,
  totalAmount,
  onBack,
  onNext,
}: {
  loading: boolean;
  items: CartItemView[];
  itemCount: number;
  totalAmount: number;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}>
      <Typography fontWeight={700} sx={{ mb: 1 }}>
        Sản phẩm đã chọn ({itemCount})
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {loading ? (
        <Typography color="text.secondary">Đang tải giỏ hàng...</Typography>
      ) : !items.length ? (
        <Typography color="text.secondary">Không có sản phẩm nào.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {items.map((it) => (
            <Stack key={it.id} direction="row" spacing={1.5} alignItems="center">
              <Avatar
                variant="square"
                src={getThumb(it.product?.main_image)}
                sx={{ width: 56, height: 56 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap fontWeight={600}>
                  {it.product?.name ?? "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {it.quantity} × {formatCurrency(it.product?.price ?? 0)}
                </Typography>
              </Box>
              <Typography fontWeight={700}>
                {formatCurrency(Number(it.product?.price ?? 0) * it.quantity)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={700}>Tổng: {formatCurrency(totalAmount)}</Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onBack}>
            Quay lại giỏ hàng
          </Button>
          <Button variant="contained" onClick={onNext} disabled={!items.length}>
            Tiếp tục
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
