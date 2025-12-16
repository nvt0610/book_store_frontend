// components/DeactivateAccountBox.tsx
import { Button, Typography, Box } from "@mui/material";
import { alertConfirm, alertError, alertSuccess } from "@/utils/alert";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/api/users";
import { authApi } from "@/api/auth"; // Import the correct authApi

export default function DeactivateAccountBox() {
  // Still need user to get the ID for the API call
  const user = useAuthStore((state) => state.user);

  const deactivate = async () => {
    if (!user) return;

    const ok = await alertConfirm(
      "Khóa tài khoản?",
      "Bạn sẽ bị đăng xuất và không thể đăng nhập lại cho đến khi được admin mở khóa."
    );
    if (!ok.isConfirmed) return;

    try {
      await userApi.updateStatus(user.id, "INACTIVE");
      alertSuccess("Tài khoản của bạn đã được khóa.");
      
      // Use the correct, encapsulated logout function
      authApi.logout(); 
      
      window.location.href = "/";
    } catch (err) {
      alertError(err?.response?.data?.message || "Đã có lỗi xảy ra.");
    }
  };

  return (
    <Box>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Khi bạn khóa tài khoản, bạn sẽ không thể đăng nhập lại.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Để mở lại tài khoản, bạn sẽ cần liên hệ với quản trị viên.
      </Typography>
      <Button color="error" variant="outlined" onClick={deactivate}>
        Khóa tài khoản
      </Button>
    </Box>
  );
}
