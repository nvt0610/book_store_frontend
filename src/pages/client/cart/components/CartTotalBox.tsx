import { Box, Typography, Button, Stack } from "@mui/material";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

interface Props {
  selectedIds: string[];
}

export default function CartTotalBox({ selectedIds }: Props) {
  const navigate = useNavigate();

  const cart = useCartStore((s) => s.cart);
  const itemsView = useCartStore((s) => s.itemsView);

  // 🎯 CHỈ TÍNH ITEM ĐƯỢC CHECK
  const totalAmount = itemsView
    .filter((it) => selectedIds.includes(it.id))
    .reduce((sum, it) => sum + Number(it.product?.price ?? 0) * it.quantity, 0);

  const handleCheckout = () => {
    if (!cart || !selectedIds.length) return;

    navigate("/checkout", {
      state: {
        cart_id: cart.id,
        item_ids: selectedIds,
      },
    });
  };

  return (
    <Box sx={{ mt: 3, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
      <Stack spacing={1}>
        <Typography fontWeight={600}>
          Tổng tiền: {formatCurrency(totalAmount)}
        </Typography>

        <Button
          variant="contained"
          size="large"
          disabled={!selectedIds.length}
          onClick={handleCheckout}
        >
          Thanh toán
        </Button>
      </Stack>
    </Box>
  );
}
