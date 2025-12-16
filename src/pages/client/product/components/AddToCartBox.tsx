import { Box, Button, Stack, IconButton, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

import { cartApi } from "@/api/cart";
import { cartItemApi } from "@/api/cartItem";
import orderApi from "@/api/orders";
import { useAuthStore } from "@/store/authStore";
import { alertSuccess, alertError } from "@/utils/alert";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartBox({ product }: { product: any }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  /** ===== SAFE DERIVED VALUES ===== */
  const stock = useMemo(
    () => Math.max(0, Number(product?.stock ?? 0)),
    [product]
  );

  const disabled = loading || stock <= 0;

  /** ===== QTY HANDLERS ===== */
  const inc = () => {
    setQty((q) => Math.min(q + 1, stock || 1));
  };

  const dec = () => {
    setQty((q) => Math.max(1, q - 1));
  };

  /** ===== ADD TO CART ===== */
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addItem(product.id, qty);
      alertSuccess("Đã thêm sản phẩm vào giỏ hàng");
    } catch (e: any) {
      alertError(e?.message || "Không thể thêm vào giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  /** ===== BUY NOW ===== */
  const handleBuyNow = async () => {
    if (!product?.id) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // NOTE:
      // address_id tạm truyền AUTO_DEFAULT
      // BE sẽ resolve address is_default
      await orderApi.buyNow({
        product_id: product.id,
        quantity: qty,
        address_id: "AUTO_DEFAULT",
      });

      alertSuccess("Đặt hàng thành công");
      navigate("/orders");
    } catch (e: any) {
      alertError(e?.message || "Không thể mua ngay");
    } finally {
      setLoading(false);
    }
  };

  /** ===== RENDER ===== */
  return (
    <Box>
      {/* Quantity + Add to cart */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 0.5,
          }}
        >
          <IconButton
            size="small"
            onClick={dec}
            disabled={disabled || qty <= 1}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography sx={{ minWidth: 32, textAlign: "center" }}>
            {qty}
          </Typography>

          <IconButton
            size="small"
            onClick={inc}
            disabled={disabled || qty >= stock}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Button
          variant="contained"
          size="large"
          sx={{ flex: 1 }}
          disabled={disabled}
          onClick={handleAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
      </Stack>

      {/* Buy now */}
      <Button
        variant="outlined"
        size="large"
        fullWidth
        sx={{ mt: 1.5 }}
        disabled={disabled}
        onClick={handleBuyNow}
      >
        Mua ngay
      </Button>

      {/* Out of stock hint */}
      {stock <= 0 && (
        <Typography
          variant="body2"
          color="error"
          sx={{ mt: 1, textAlign: "center" }}
        >
          Sản phẩm đã hết hàng
        </Typography>
      )}
    </Box>
  );
}
