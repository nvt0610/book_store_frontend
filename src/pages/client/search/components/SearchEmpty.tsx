import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SearchEmpty({ keyword }: { keyword?: string }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Không tìm thấy kết quả
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {keyword
          ? `Không có sản phẩm nào phù hợp với "${keyword}"`
          : "Không có sản phẩm nào"}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{ borderRadius: 2, px: 4 }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
}
