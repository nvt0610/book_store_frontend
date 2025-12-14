// components/DeactivateAccountBox.tsx
import { Button, Typography, Box } from "@mui/material";
import { alertConfirm } from "@/utils/alert";
import { authApi } from "@/api/auth";

export default function DeactivateAccountBox() {
  const deactivate = async () => {
    const ok = await alertConfirm(
      "Khóa tài khoản?",
      "Bạn sẽ bị đăng xuất và không thể đăng nhập lại."
    );
    if (!ok.isConfirmed) return;

    // TODO: nếu sau này có API /auth/deactivate → gọi ở đây
    authApi.logout();
    window.location.href = "/";
  };

  return (
    <Box>
      <Typography color="error" sx={{ mb: 2 }}>
        Hành động này không thể hoàn tác
      </Typography>
      <Button color="error" variant="contained" onClick={deactivate}>
        Khóa tài khoản
      </Button>
    </Box>
  );
}
