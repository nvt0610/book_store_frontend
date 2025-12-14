import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CartItemRow from "@/components/cart/CartItemRow";
import type { OrderDetailItem } from "../orderDetail.types";

interface Props {
  items: OrderDetailItem[];
}

export default function OrderItemsList({ items }: Props) {
  const navigate = useNavigate();

  return (
    <Stack spacing={1}>
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          readOnly
          onClickProduct={() =>
            navigate(`/product/${item.product.id}`)
          }
        />
      ))}
    </Stack>
  );
}
