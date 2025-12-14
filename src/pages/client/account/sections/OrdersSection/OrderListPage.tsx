import { Box, Stack, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "./orderList.service";
import OrderRow from "./components/OrderRow";

export default function OrderListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    fetchMyOrders()
      .then((res) => mounted && setOrders(res.data))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
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
      <Typography color="text.secondary">
        Bạn chưa có đơn hàng nào.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {orders.map((o) => (
        <OrderRow
          key={o.id}
          order={o}
          onClick={() => navigate(`/account/orders/${o.id}`)}
        />
      ))}
    </Stack>
  );
}
