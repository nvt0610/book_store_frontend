import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function TopBar({ onToggle }: { onToggle: () => void }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#fff",
        color: "#111",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* button mobile */}
        <IconButton sx={{ display: { md: "none" } }} onClick={onToggle}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>

        <Typography sx={{ opacity: 0.7 }}>
          {new Date().toLocaleDateString()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
