import { Stack, Skeleton, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "./orderList.service";
import OrderRow from "./components/OrderRow";

export default function OrderListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton height={100} />
        <Skeleton height={100} />
      </Stack>
    );
  }

  if (!orders.length) {
    return (
      <Typography color="text.secondary">Bạn chưa có đơn hàng nào.</Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {orders.map((order) => (
        <Stack key={order.id} spacing={1}>
          <OrderRow
            order={order}
            open={openOrderId === order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            onToggleItems={() =>
              setOpenOrderId(openOrderId === order.id ? null : order.id)
            }
          />

          {/* ACTIONS */}
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() =>
                navigate("/checkout", {
                  state: { mode: "ORDER", order_id: order.id },
                })
              }
            >
              Mua lại
            </Button>

            {order.status === "PENDING" && (
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/checkout", {
                    state: { mode: "ORDER", order_id: order.id },
                  })
                }
              >
                Thanh toán
              </Button>
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
