import {
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
  Button,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import OrderStatusChip from "./OrderStatusChip";
import { formatCurrency } from "@/utils/currency";
import OrderItemsList from "./OrderItemsList";
import orderApi from "@/api/orders";
import { unwrapList } from "@/utils/unwrap";

export default function OrderRow({
  order,
  open,
  onClick,
  onToggleItems,
}: {
  order: any;
  open: boolean;
  onClick: () => void;
  onToggleItems: () => void;
}) {
  const [items, setItems] = useState<any[] | null>(null);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open && !loaded) {
      setLoadingItems(true);
      orderApi
        .listItems(order.id)
        .then((res) => {
          setItems(unwrapList(res));
          setLoaded(true);
        })
        .finally(() => setLoadingItems(false));
    }
  }, [open]);

  return (
    <Card variant="outlined">
      {/* CLICK → ORDER DETAIL */}
      <CardActionArea onClick={onClick}>
        <Box p={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>
              Đơn hàng #{order.id.slice(0, 8)}
            </Typography>
            <OrderStatusChip status={order.status} />
          </Stack>

          <Typography fontSize={13} color="text.secondary">
            Đặt lúc:{" "}
            {order.placed_at
              ? new Date(order.placed_at).toLocaleString("vi-VN")
              : "-"}
          </Typography>

          <Typography fontWeight={600} mt={1}>
            Tổng tiền: {formatCurrency(order.total_amount)}
          </Typography>
        </Box>
      </CardActionArea>

      {/* TOGGLE */}
      <Box px={2} pb={1}>
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // ⭐ CỰC QUAN TRỌNG
            onToggleItems();
          }}
        >
          {open ? "Ẩn sản phẩm ▲" : "Xem sản phẩm ▼"}
        </Button>
      </Box>

      {/* ITEMS */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box px={2} pb={2}>
          {loadingItems ? (
            <CircularProgress size={20} />
          ) : (
            <OrderItemsList items={items ?? []} />
          )}
        </Box>
      </Collapse>
    </Card>
  );
}
