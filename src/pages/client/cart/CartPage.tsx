// src/pages/client/cart/CartPage.tsx
import { Box, Typography, Button, Stack } from "@mui/material";
import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import CartItemTable from "./components/CartItemTable";
import CartTotalBox from "./components/CartTotalBox";

export default function CartPage() {
  const { itemsView, clearCart } = useCartStore();

  // 🎯 STATE: cart item được chọn
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // toggle chọn 1 item
  const toggleItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  // chọn / bỏ chọn tất cả
  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? itemsView.map((i) => i.id) : []);
  };

  const allChecked =
    itemsView.length > 0 && selectedIds.length === itemsView.length;

  if (!itemsView.length) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography>Giỏ hàng trống</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Giỏ hàng
      </Typography>

      {/* 🎯 TABLE */}
      <CartItemTable
        items={itemsView}
        selectedIds={selectedIds}
        onToggle={toggleItem}
        onToggleAll={toggleAll}
        allChecked={allChecked}
      />

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Button color="error" onClick={clearCart}>
          Xóa toàn bộ giỏ hàng
        </Button>
      </Stack>

      {/* 🎯 TOTAL + CHECKOUT */}
      <CartTotalBox selectedIds={selectedIds} />
    </Box>
  );
}
