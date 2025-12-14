// src/pages/client/checkout/components/CheckoutResult.tsx
import { Box, Button, Stack, Typography } from "@mui/material";

export default function CheckoutResult({
  orderId,
  onGoHome,
  onGoCart,
}: {
  orderId: string;
  onGoHome: () => void;
  onGoCart: () => void;
}) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
        Đặt hàng thành công
      </Typography>

      {!!orderId && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Mã đơn hàng: <b>{orderId}</b>
        </Typography>
      )}

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={onGoHome}>
          Về trang chủ
        </Button>
        <Button variant="outlined" onClick={onGoCart}>
          Về giỏ hàng
        </Button>
      </Stack>
    </Box>
  );
}
