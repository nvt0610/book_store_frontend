import { Box, Button, Stack, TextField, InputAdornment, IconButton } from "@mui/material";
import { useState } from "react";
import { userApi } from "@/api/users";
import { alertError, alertSuccess } from "@/utils/alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<any>({});

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((p: any) => ({ ...p, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.current_password) {
      newErrors.current_password = "Mật khẩu hiện tại là bắt buộc";
    }
    if (!form.new_password) {
      newErrors.new_password = "Mật khẩu mới là bắt buộc";
    } else if (form.new_password.length < 6) {
      newErrors.new_password = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }
    if (form.new_password !== form.confirm_password) {
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActualSubmit = async () => {
    try {
      setLoading(true);
      await userApi.changeMyPassword({
        current_password: form.current_password,
        new_password: form.new_password,
      });
      alertSuccess("Đổi mật khẩu thành công");
      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (e: any) {
      alertError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    Swal.fire({
      title: 'Xác nhận đổi mật khẩu?',
      text: "Bạn có chắc chắn muốn thực hiện hành động này không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        handleActualSubmit();
      }
    });
  };

  return (
    <Box mt={2}>
      <Stack spacing={2}>
        <TextField
          name="current_password"
          label="Mật khẩu hiện tại"
          type={showCurrentPassword ? "text" : "password"}
          value={form.current_password}
          onChange={handleFormChange}
          error={!!errors.current_password}
          helperText={errors.current_password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCurrentPassword((s) => !s)}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="new_password"
          label="Mật khẩu mới"
          type={showNewPassword ? "text" : "password"}
          value={form.new_password}
          onChange={handleFormChange}
          error={!!errors.new_password}
          helperText={errors.new_password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword((s) => !s)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          name="confirm_password"
          label="Xác nhận mật khẩu mới"
          type={showConfirmPassword ? "text" : "password"}
          value={form.confirm_password}
          onChange={handleFormChange}
          error={!!errors.confirm_password}
          helperText={errors.confirm_password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Đang đổi..." : "Đổi mật khẩu"}
        </Button>
      </Stack>
    </Box>
  );
}
