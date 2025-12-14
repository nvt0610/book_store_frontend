// src/pages/client/checkout/CheckoutResultPage.tsx
import { Box, Button, Stack, Typography, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CheckoutResultPage() {
  const navigate = useNavigate();
  const query = useQuery();

  const success = query.get("success") === "1";
  const code = query.get("code");

  const orderId = query.get("order_id");
  const paymentId = query.get("payment_id");

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 6 }}>
      <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 3 }}>
        {/* ===== TITLE ===== */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          {success ? "Thanh toán thành công" : "Thanh toán chưa hoàn tất"}
        </Typography>

        {/* ===== STATUS MESSAGE ===== */}
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Giao dịch đã được xử lý thành công. Cảm ơn bạn đã mua hàng!
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            Thanh toán không thành công hoặc đã hết hạn. Bạn có thể thử lại hoặc
            xem đơn hàng để thanh toán sau.
          </Alert>
        )}

        {/* ===== ORDER INFO ===== */}
        {orderId && (
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Mã đơn hàng: <b>{orderId}</b>
          </Typography>
        )}

        {paymentId && (
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Mã giao dịch: <b>{paymentId}</b>
          </Typography>
        )}

        {!success && code && (
          <Typography color="error" sx={{ mb: 2 }}>
            Mã lỗi: {code}
          </Typography>
        )}

        {/* ===== ACTIONS ===== */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {orderId && (
            <Button
              variant="contained"
              onClick={() => navigate(`/account/orders/${orderId}`)}
            >
              Xem chi tiết đơn hàng
            </Button>
          )}

          {!success && (
            <Button
              variant="outlined"
              onClick={() => navigate("/checkout")}
            >
              Thử thanh toán lại
            </Button>
          )}

          <Button variant="text" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
