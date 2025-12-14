// src/components/cart/CartItemRow.tsx
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Checkbox,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCartStore } from "@/store/cartStore";
import type { CartItemView } from "@/store/cartStore";
import { getThumb } from "@/utils/image";
import { formatCurrency } from "@/utils/currency";
import { useEffect, useState } from "react";
import { alertConfirm, alertToast } from "@/utils/alert";

interface Props {
  item: CartItemView;
  checked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

export default function CartItemRow({ item, checked, onToggle }: Props) {
  const { updateQty, removeItem } = useCartStore();

  const price = Number(item.product?.price ?? 0);
  const stock = Number(item.product?.stock ?? Infinity);

  // 🎯 local state cho input
  const [localQty, setLocalQty] = useState(item.quantity);
  const [showStockWarning, setShowStockWarning] = useState(false);

  // sync khi store đổi (vd update từ nơi khác)
  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const commitQty = (raw: number) => {
    if (!Number.isFinite(raw)) return;

    let next = Math.floor(raw);

    // Clamp giữa 1 và stock
    if (next < 1) next = 1;
    if (next > stock) {
      next = stock;
      setShowStockWarning(true); // 🔔 Hiện cảnh báo
    }

    setLocalQty(next); // sync UI

    if (next !== item.quantity) {
      updateQty(item.id, next);
    }
  };

  const handleIncrement = () => {
    const next = localQty + 1;
    if (next > stock) {
      setShowStockWarning(true);
      return;
    }
    commitQty(next);
  };

  const handleDecrement = () => {
    commitQty(localQty - 1);
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
        {/* CHECKBOX */}
        <Checkbox
          checked={checked}
          onChange={(e) => onToggle(item.id, e.target.checked)}
        />

        <Avatar
          variant="square"
          src={getThumb(item.product?.main_image)}
          sx={{ width: 64, height: 64 }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography noWrap fontWeight={500}>
            {item.product?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(price)}
          </Typography>
          {stock !== Infinity && (
            <Typography variant="caption" color="text.secondary">
              Tồn kho: {stock}
            </Typography>
          )}
        </Box>

        {/* QTY CONTROL */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            size="small"
            disabled={localQty <= 1}
            onClick={handleDecrement}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            size="small"
            type="number"
            value={localQty}
            onChange={(e) => {
              const raw = e.target.value;

              // cho xóa tạm để user sửa số
              if (raw === "") {
                setLocalQty(1);
                return;
              }

              let v = Number(raw);
              if (Number.isNaN(v)) return;

              v = Math.floor(v);

              if (v < 1) v = 1;
              if (v > stock) {
                v = stock;
                alertToast(`Số lượng tối đa cho sản phẩm này là ${stock}`);
              }
              setLocalQty(v);
            }}
            onBlur={() => commitQty(localQty)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitQty(localQty);
                e.currentTarget.blur();
              }
            }}
            inputProps={{
              min: 1,
              max: stock,
              inputMode: "numeric",
              style: { textAlign: "center", width: 56 },
            }}
          />
          <IconButton
            size="small"
            disabled={localQty >= stock}
            onClick={handleIncrement}
          >
            <AddIcon />
          </IconButton>
        </Stack>

        <Typography sx={{ width: 120, textAlign: "right" }}>
          {formatCurrency(item.subtotal ?? 0)}
        </Typography>

        <IconButton
          color="error"
          onClick={async () => {
            const res = await alertConfirm(
              "Xóa sản phẩm?",
              "Sản phẩm sẽ bị xóa khỏi giỏ hàng"
            );
            if (res.isConfirmed) {
              removeItem(item.id);
            }
          }}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Stack>
    </>
  );
}
