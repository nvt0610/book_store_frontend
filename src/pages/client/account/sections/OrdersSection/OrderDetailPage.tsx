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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import orderDetailService from "../../../orders/orderDetail.service";
import type { OrderDetail } from "../../../orders/orderDetail.types";
import { formatCurrency } from "@/utils/currency";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await orderDetailService.getById(id);
        if (mounted) setOrder(data);
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const renderStatus = (status: string) => {
    const map: Record<string, any> = {
      PENDING: { color: "warning", label: "PENDING" },
      COMPLETED: { color: "success", label: "COMPLETED" },
      INACTIVE: { color: "default", label: "INACTIVE" },
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
          onClick={() => navigate("/account")}
        >
          Tài khoản
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
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
