import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import UserMenu from "./UserMenu";
import SearchBarGlobal from "@/components/common/SearchBarGlobal";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer";

const APP_NAME = import.meta.env.VITE_APP_NAME || "Book Store";

export default function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const itemCount = useCartStore((s) => s.itemCount);
  const [openCart, setOpenCart] = useState(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "#fff", color: "#111", borderBottom: "1px solid #e5e7eb" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          px: 3,
          py: 1.5,
        }}
      >
        {/* LEFT: LOGO */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="img"
            src="/logo.png"
            sx={{ height: 46, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {APP_NAME}
          </Typography>
        </Box>

        {/* SEARCH */}
        <Box sx={{ flex: 1, maxWidth: 600 }}>
          <SearchBarGlobal
            placeholder="Tìm kiếm sách, tác giả..."
            onSearch={(kw) => console.log("Search:", kw)}
          />
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* CART */}
          <IconButton onClick={() => setOpenCart(true)}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCartOutlinedIcon sx={{ fontSize: 28 }} />
            </Badge>
          </IconButton>
          <UserMenu user={user} />
          <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
