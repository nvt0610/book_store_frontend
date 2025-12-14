// src/pages/client/cart/components/CartItemTable.tsx
import { Box, Divider, Checkbox, Stack, Typography } from "@mui/material";
import type { CartItemView } from "@/store/cartStore";
import CartItemRow from "@/components/cart/CartItemRow";

interface Props {
  items: CartItemView[];
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  allChecked: boolean;
}

export default function CartItemTable({
  items,
  selectedIds,
  onToggle,
  onToggleAll,
  allChecked,
}: Props) {
  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <Checkbox
          checked={allChecked}
          onChange={(e) => onToggleAll(e.target.checked)}
        />
        <Typography fontWeight={600}>Chọn tất cả</Typography>
      </Stack>

      <Divider />

      {/* ROWS */}
      {items.map((item, idx) => (
        <Box key={item.id}>
          <CartItemRow
            item={item}
            checked={selectedIds.includes(item.id)}
            onToggle={onToggle}
          />
          {idx < items.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
}
