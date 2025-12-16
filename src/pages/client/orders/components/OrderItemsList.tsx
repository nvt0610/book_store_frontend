import { Box, Stack } from "@mui/material";
import CartItemRow from "@/components/cart/CartItemRow";

export default function OrderItemsList({ items }: { items: any[] }) {
  return (
    <Box
      sx={{
        maxHeight: 320,        // ✅ KHÔNG giãn layout
        overflowY: "auto",     // ✅ scroll nếu nhiều
        borderTop: "1px solid #eee",
        mt: 1,
        pt: 1,
      }}
    >
      <Stack spacing={1}>
        {items.map((it) => (
          <CartItemRow
            key={it.id}
            item={{
              ...it,
              subtotal: Number(it.price) * it.quantity,
            }}
            readOnly
          />
        ))}
      </Stack>
    </Box>
  );
}
