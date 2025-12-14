import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FormSubmitBar({
  backUrl,
  loading,
  isEdit,
  onSubmit,
}: {
  backUrl: string;
  loading: boolean;
  isEdit: boolean;
  onSubmit: () => any;
}) {
  const navigate = useNavigate();

  return (
    <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
      <Button variant="outlined" onClick={() => navigate(backUrl)}>
        Hủy
      </Button>

      <Button variant="contained" disabled={loading} onClick={onSubmit}>
        {loading ? "Đang lưu…" : isEdit ? "Cập nhật" : "Tạo mới"}
      </Button>
    </Box>
  );
}
