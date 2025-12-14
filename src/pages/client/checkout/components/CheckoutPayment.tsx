// src/pages/client/checkout/components/CheckoutPayment.tsx
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import type { CheckoutPaymentMethod } from "../checkout.types";

export default function CheckoutPayment({
  value,
  onChange,
}: {
  value: CheckoutPaymentMethod;
  onChange: (v: CheckoutPaymentMethod) => void;
}) {
  return (
    <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, mb: 2 }}>
      <Typography fontWeight={700} sx={{ mb: 1 }}>
        Phương thức thanh toán
      </Typography>

      <FormControl>
        <RadioGroup
          value={value}
          onChange={(e) => onChange(e.target.value as CheckoutPaymentMethod)}
        >
          <FormControlLabel
            value="COD"
            control={<Radio />}
            label="COD (Thanh toán khi nhận hàng)"
          />
          <FormControlLabel
            value="MOMO"
            control={<Radio />}
            label="MOMO (sắp làm)"
            disabled
          />
          <FormControlLabel
            value="VNPAY"
            control={<Radio />}
            label="VNPAY (Thanh toán qua ngân hàng)"
          />{" "}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
