// src/pages/client/checkout/components/CheckoutAddress.tsx
import { Box, Typography } from "@mui/material";
import AddressSelectPanel from "@/components/form/AddressSelectPanel";

export default function CheckoutAddress({
  userId,
  value,
  addresses,
  loading,
  onChange,
}: {
  userId: string;
  value: string;
  addresses: any[];
  loading: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2 }}>
      <Typography fontWeight={700}>Địa chỉ giao hàng</Typography>

      <AddressSelectPanel
        userId={userId}
        value={value}
        options={addresses}
        loading={loading}
        onChange={onChange}
      />
    </Box>
  );
}
