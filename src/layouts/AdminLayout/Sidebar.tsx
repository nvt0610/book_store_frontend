import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";

import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminMenuGroups, systemMenu } from "./menuItems";
import { authApi } from "@/api/auth";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // mở mặc định tất cả group
  const initial = {};
  adminMenuGroups.forEach((g) => (initial[g.label] = true));
  const [openGroups, setOpenGroups] = useState(initial);

  const toggleGroup = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleClick = (item) => {
    if (item.action === "logout") {
      authApi.logout();
      navigate("/");
      return;
    }
    navigate(item.path);
  };

  return (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid #e5e7eb",

        /*  FIX: KHÔNG BAO GIỜ scroll ngang */
        overflowX: "hidden !important",
        overflowY: "auto",
        whiteSpace: "nowrap",

        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#c1c1c1" },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, textAlign: "center", py: 3 }}
      >
        Admin Dashboard
      </Typography>

      <List sx={{ px: 1 }}>
        {adminMenuGroups.map((group) => {
          const isOpen = openGroups[group.label];

          return (
            <Box key={group.label}>
              {/* GROUP HEADER — giữ style bản cũ */}
              <ListItemButton
                onClick={() => toggleGroup(group.label)}
                sx={{
                  px: 1,
                  height: 34,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#444",
                      }}
                    >
                      {group.label}
                    </Typography>
                  }
                />

                {/* ICON XOAY — nhưng không chiếm width */}
                <ExpandMore
                  sx={{
                    transition: "0.25s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    fontSize: "1.1rem",
                  }}
                />
              </ListItemButton>

              {/* ITEMS */}
              <Collapse in={isOpen} timeout={200} unmountOnExit>
                {group.items.map((item) => {
                  const active = location.pathname === item.path;

                  return (
                    <ListItemButton
                      key={item.label}
                      onClick={() => handleClick(item)}
                      sx={{
                        pl: 3,
                        height: 44, // 🔥 to hơn
                        bgcolor: active ? "#e8f2ff" : "transparent",
                        borderLeft: active
                          ? "3px solid #1976d2"
                          : "3px solid transparent",
                        "&:hover": { bgcolor: active ? "#dceaff" : "#f5f5f5" },
                        transition: "0.15s",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32, // giảm width FIX PHÌNH
                          color: active ? "#1976d2" : "#555",
                          transition: "0.2s",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: "0.85rem",
                              color: active ? "#1976d2" : "#333",
                              fontWeight: active ? 600 : 400,
                              whiteSpace: "nowrap",

                              overflow: "hidden", // Nếu dài quá thì …
                              textOverflow: "ellipsis", // … thì hiện dấu …
                            }}
                          >
                            {item.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}

        {/* SYSTEM MENU */}
        <Box sx={{ mt: 1, borderTop: "1px solid #eee" }} />

        {systemMenu.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => handleClick(item)}
            sx={{ px: 1, height: 36 }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: item.action ? "#d32f2f" : "#1976d2",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
