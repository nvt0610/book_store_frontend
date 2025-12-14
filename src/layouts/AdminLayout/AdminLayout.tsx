import { Box, Drawer } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useState } from "react";

const drawerWidth = 220;

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen((v) => !v);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f7f8fa", minHeight: "100vh" }}>
      <TopBar onToggle={toggleSidebar} />

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: "none", md: "block" } }}
        PaperProps={{
          sx: {
            width: "auto",
            minWidth: 220, // giữ chiều rộng tối thiểu
            boxSizing: "border-box",
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleSidebar}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{ sx: { width: drawerWidth } }}
      >
        <Sidebar />
      </Drawer>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          p: 3,
          ml: { md: `${drawerWidth}px` },
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
