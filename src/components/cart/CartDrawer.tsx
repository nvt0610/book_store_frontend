import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCartStore } from "@/store/cartStore";
import { getThumb } from "@/utils/image";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();

  const itemsView = useCartStore((s) => s.itemsView);
  const totalAmount = useCartStore((s) =>
    s.itemsView.reduce(
      (sum, it) => sum + Number(it.product?.price ?? 0) * it.quantity,
      0
    )
  );
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Giỏ hàng</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {!itemsView.length ? (
          <Typography sx={{ mt: 4 }} color="text.secondary">
            Giỏ hàng trống
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {itemsView.map((it) => (
              <Stack
                key={it.id}
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Avatar
                  variant="square"
                  src={getThumb(it.product?.main_image)}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Tooltip title={it.product?.name ?? ""} arrow>
                    <Typography
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "default",
                      }}
                    >
                      {it.product?.name ?? "—"}
                    </Typography>
                  </Tooltip>

                  <Typography variant="body2" color="text.secondary">
                    {it.quantity} ×{" "}
                    {Number(it.product?.price ?? 0).toLocaleString("vi-VN")} đ
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}

        {!!itemsView.length && (
          <>
            <Typography sx={{ mt: 2, fontWeight: 600 }}>
              Tổng: {totalAmount.toLocaleString("vi-VN")} đ
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              Xem giỏ hàng
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
}
