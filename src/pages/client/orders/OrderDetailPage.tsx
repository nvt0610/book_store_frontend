import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Skeleton,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OrderItemsList from "./components/OrderItemsList";

import orderDetailService from "./orderDetail.service";
import orderApi from "@/api/orders";
import type { OrderDetail } from "./orderDetail.types";
import { formatCurrency } from "@/utils/currency";
import { alertSuccess, alertError } from "@/utils/alert";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  // Cancel Dialog
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await orderDetailService.getById(id);
      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleCancelSubmit = async () => {
    if (!id) return;
    try {
      setCancelling(true);
      await orderApi.cancelOrder(id, cancelReason);
      alertSuccess("Đã hủy đơn hàng thành công");
      setCancelOpen(false);
      loadOrder(); // Reload status
    } catch (err: any) {
      alertError(err?.message || "Hủy đơn thất bại");
    } finally {
      setCancelling(false);
    }
  };

  const renderStatus = (status: string) => {
    const map: Record<string, any> = {
      PENDING: { color: "warning", label: "Chờ xử lý" },
      COMPLETED: { color: "success", label: "Hoàn thành" },
      INACTIVE: { color: "default", label: "Đã hủy" },
    };
    const cfg = map[status] || { color: "default", label: status };
    return <Chip size="small" color={cfg.color} label={cfg.label} />;
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3, px: { xs: 1, sm: 2 } }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/orders")}
        >
          Danh sách đơn hàng
        </Link>
        <Typography color="text.secondary">
          {loading ? "Đang tải..." : `Đơn hàng ${order?.id}`}
        </Typography>
      </Breadcrumbs>

      {loading ? (
        <Skeleton height={400} />
      ) : !order ? (
        <Typography>Không tìm thấy đơn hàng.</Typography>
      ) : (
        <Stack spacing={3}>
          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography fontWeight={700}>
                Đơn hàng #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đặt lúc:{" "}
                {order.placed_at
                  ? new Date(order.placed_at).toLocaleString("vi-VN")
                  : "-"}
              </Typography>
            </Box>
            {renderStatus(order.status)}
          </Stack>

          <Divider />

          {/* CANCEL REASON */}
          {order.status === "INACTIVE" && order.cancel_reason && (
            <Box
              sx={{
                p: 2,
                bgcolor: "error.lighter", // Bạn có thể cần định nghĩa màu này hoặc dùng màu hex
                backgroundColor: "#fff4f4",
                border: "1px dashed",
                borderColor: "error.main",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" color="error.main" fontWeight={700}>
                Đơn hàng đã bị hủy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lý do: {order.cancel_reason}
              </Typography>
            </Box>
          )}

          {/* ITEMS */}
          <OrderItemsList items={order.items} />

          <Divider />

          {/* SUMMARY */}
          <Stack spacing={1} alignItems="flex-end">
            <Typography fontWeight={600}>
              Tổng tiền: {formatCurrency(order.total_amount)}
            </Typography>

            {order.payment && (
              <Typography variant="body2" color="text.secondary">
                Thanh toán: {order.payment.payment_method} •{" "}
                {order.payment.status}
              </Typography>
            )}

            {/* ACTION BUTTONS */}
            {order.status === "PENDING" && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setCancelOpen(true)}
                >
                  Hủy đơn hàng
                </Button>
              </Box>
            )}
          </Stack>
        </Stack>
      )}

      {/* CANCEL DIALOG */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle>Hủy đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể
            hoàn tác.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do hủy (tùy chọn)"
            type="text"
            fullWidth
            variant="outlined"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)} disabled={cancelling}>
            Đóng
          </Button>
          <Button
            onClick={handleCancelSubmit}
            color="error"
            disabled={cancelling}
          >
            {cancelling ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
