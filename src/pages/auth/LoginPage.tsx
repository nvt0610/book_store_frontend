import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/api/auth";
import { validate } from "@/utils/validation";
import { alertError, alertSuccess } from "@/utils/alert";
import { Link as RouterLink } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      validate.required(form.email, "Email");
      validate.email(form.email);
      validate.required(form.password, "Mật khẩu");

      setLoading(true);

      // authApi.login() TRẢ VỀ user
      const user = await authApi.login(form.email.trim(), form.password);

      alertSuccess("Đăng nhập thành công!");

      setTimeout(() => {
        if (user?.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 800);

    } catch (err: any) {
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.message;

      let msg = "Đăng nhập thất bại, vui lòng thử lại";

      if (status === 401 || status === 404) {
        msg = "Email hoặc mật khẩu không đúng";
      } else if (backendMsg) {
        msg = backendMsg;
      }

      alertError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f1f3f5",
      }}
    >
      <Card sx={{ width: 380, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>
            Đăng nhập
          </Typography>

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Mật khẩu"
            name="password"
            fullWidth
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.2 }}
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <Box textAlign="center" mt={2}>
            <Link component={RouterLink} to="/register" underline="hover">
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
