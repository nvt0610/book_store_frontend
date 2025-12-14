import {
  Box,
  Card,
  CardActionArea,
  Stack,
  Typography,
} from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";
import { formatCurrency } from "@/utils/currency";

export default function OrderRow({
  order,
  onClick,
}: {
  order: any;
  onClick: () => void;
}) {
  return (
    <Card variant="outlined">
      <CardActionArea onClick={onClick}>
        <Box p={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={600}>
              Đơn hàng #{order.id.slice(0, 8)}
            </Typography>
            <OrderStatusChip status={order.status} />
          </Stack>

          <Typography fontSize={13} color="text.secondary" mt={0.5}>
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
    </Card>
  );
}
