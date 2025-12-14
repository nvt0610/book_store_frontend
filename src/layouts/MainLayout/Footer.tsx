import { Box, Typography } from "@mui/material";

const APP_NAME = import.meta.env.VITE_APP_NAME || "Book Store";
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderTop: "1px solid #e5e7eb",
        textAlign: "center",
        py: 4,
        mt: "auto",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {APP_NAME}
      </Typography>
      <Typography sx={{ mt: 1 }}>© {year} {APP_NAME}. All rights reserved.</Typography>
      <Typography sx={{ mt: 0.5 }}>Liên hệ: <strong>nvt0610@gmail.com</strong></Typography>
      <Typography sx={{ mt: 0.5, opacity: 0.7, fontSize: "0.8rem" }}>
        Designed for academic & demo purposes.
      </Typography>
    </Box>
  );
}
