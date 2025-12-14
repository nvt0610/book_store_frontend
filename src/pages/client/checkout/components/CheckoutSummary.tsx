// src/pages/client/checkout/components/CheckoutSummary.tsx
import { Box, Button, Stack, Typography } from "@mui/material";
import { formatCurrency } from "@/utils/currency";

export default function CheckoutSummary({
  totalAmount,
  submitting,
  canSubmit,
  onSubmit,
}: {
  totalAmount: number;
  submitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}>
      <Stack spacing={2}>
        <Typography fontWeight={700}>
          Tổng thanh toán: {formatCurrency(totalAmount)}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Đang xử lý..." : "Thanh toán"}
        </Button>
      </Stack>
    </Box>
  );
}
