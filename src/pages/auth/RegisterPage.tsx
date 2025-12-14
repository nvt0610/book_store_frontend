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

import axiosClient from "@/api/axiosClient";
import { validate } from "@/utils/validation";
import { alertError, alertSuccess } from "@/utils/alert";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      // ======= FRONTEND VALIDATE =======
      validate.required(form.first_name, "Họ");
      validate.required(form.last_name, "Tên");
      validate.required(form.email, "Email");
      validate.email(form.email);
      validate.password(form.password);
      validate.phone(form.phone);

      // ======= NORMALIZE NAME (GIỐNG BACKEND) =======
      const { full_name, first_name, last_name } = validate.normalizeName({
        first_name: form.first_name,
        last_name: form.last_name,
      });

      const payload = {
        full_name,
        first_name,
        last_name,
        email: validate.trim(form.email),
        password: form.password,
        phone: validate.trim(form.phone),
      };

      setLoading(true);

      // ======= CALL API REGISTER =======
      await axiosClient.post("/auth/register", payload);

      alertSuccess("Đăng ký thành công!");

      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err.message || "Lỗi không xác định";
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
      <Card sx={{ width: 420, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>
            Đăng ký tài khoản
          </Typography>

          <TextField
            label="Họ"
            name="first_name"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          <TextField
            label="Tên"
            name="last_name"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
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

          <TextField
            label="Số điện thoại"
            name="phone"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.2 }}
            disabled={loading}
            onClick={handleRegister}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>

          <Box textAlign="center" mt={2}>
            <Link href="/login" underline="hover">
              Đã có tài khoản? Đăng nhập ngay
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
