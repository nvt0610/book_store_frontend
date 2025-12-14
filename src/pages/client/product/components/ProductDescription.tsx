import { Box, Typography } from "@mui/material";

export default function ProductDescription({
  description,
}: {
  description?: string | null;
}) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Mô tả sản phẩm
      </Typography>

      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-line", color: "text.secondary" }}
      >
        {description || "Chưa có mô tả cho sản phẩm này."}
      </Typography>
    </Box>
  );
}
