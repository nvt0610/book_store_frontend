import { useState } from "react";
import { Box, IconButton, Paper, ClickAwayListener } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";

export default function UserMenu({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const MenuItem = ({ text, action, color }) => (
    <Box
      sx={{
        px: 2,
        py: 1,
        cursor: "pointer",
        "&:hover": { bgcolor: "#f5f5f5" },
        color: color || "#111",
      }}
      onClick={action}
    >
      {text}
    </Box>
  );

  if (!user)
    return (
      <Box
        sx={{ cursor: "pointer", fontWeight: 600 }}
        onClick={() => navigate("/login")}
      >
        Đăng nhập
      </Box>
    );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative" }}>
        <IconButton onClick={() => setOpen((v) => !v)}>
          <AccountCircleIcon sx={{ fontSize: 34 }} />
        </IconButton>

        {open && (
          <Paper
            sx={{
              position: "absolute",
              right: 0,
              mt: 1,
              borderRadius: 2,
              overflow: "hidden",
              minWidth: 180,
              py: 0.5,
              boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
              zIndex: 20,
            }}
          >
            <MenuItem text="Trang cá nhân" action={() => navigate("/profile")} />
            <MenuItem text="Đơn mua" action={() => navigate("/orders")} />

            {user.role === "ADMIN" && (
              <MenuItem
                text="Quản trị hệ thống"
                action={() => navigate("/admin")}
                color="#1976d2"
              />
            )}

            <MenuItem
              text="Đăng xuất"
              action={() => {
                authApi.logout();
                navigate("/");
              }}
              color="#d32f2f"
            />
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
