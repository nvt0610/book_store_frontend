// src/pages/client/checkout/components/CheckoutAddress.tsx
import { Box, Typography } from "@mui/material";
import AddressSelectPanel from "@/components/form/AddressSelectPanel";

export default function CheckoutAddress({
  userId,
  value,
  onChange,
}: {
  userId: string;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}>
      <Typography fontWeight={700} sx={{ mb: 1 }}>
        Địa chỉ giao hàng
      </Typography>

      <AddressSelectPanel
        userId={userId}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
}
