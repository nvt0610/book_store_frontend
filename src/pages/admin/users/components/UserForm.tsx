import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate } from "react-router-dom";
import { userApi } from "@/api/users";

import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";

import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";

import { usePhoneField } from "@/hooks/usePhoneField";

export default function UserForm({ initialData }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const phone = usePhoneField(11);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "CUSTOMER",
    status: "ACTIVE",
    password: "",
  });

  // ---------------------------------------
  // LOAD INITIAL DATA
  // ---------------------------------------
  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role || "CUSTOMER",
        status: initialData.status || "ACTIVE",
        password: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // ---------------------------------------
  // SUBMIT FORM
  // ---------------------------------------
  const handleSubmit = async () => {
    try {
      validate.required(form.first_name, "First name");
      validate.required(form.last_name, "Last name");
      validate.required(form.email, "Email");
      validate.email(form.email);

      if (!isEdit) {
        validate.required(form.password, "Password");
        validate.password(form.password);
      } else if (form.password.trim()) {
        validate.password(form.password);
      }

      if (form.phone) validate.phone(form.phone);

      setLoading(true);

      if (isEdit) {
        await userApi.update(initialData.id, {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim() || undefined,
          role: form.role,
          status: form.status,
          password: form.password || undefined,
        });

        alertSuccess("Cập nhật user thành công");
      } else {
        await userApi.create({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined,
          role: form.role,
        });

        alertSuccess("Tạo user mới thành công");
      }

      navigate("/admin/users");
    } catch (err) {
      alertError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <Box sx={{ px: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <FormSection title="Thông tin tài khoản">
            <Grid container spacing={2}>
              {/* ✦ FIRST NAME – LAST NAME – PHONE (1 LINE) */}
              {/* ✦ FIRST NAME – LAST NAME – PHONE */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="First name"
                    name="first_name"
                    fullWidth
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Last name"
                    name="last_name"
                    fullWidth
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </Grid>

                {/* ====== PHONE WITH BUILT-IN ERROR UNDER FIELD ====== */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    value={phone.value}
                    error={!!phone.error}
                    helperText={phone.error || " "}
                    onChange={(e) => {
                      phone.onChange(e.target.value);
                      setForm((p) => ({ ...p, phone: e.target.value }));
                    }}
                  />
                </Grid>
              </Grid>

              {/* ========================== */}
              {/*  EMAIL + PASSWORD cùng hàng  */}
              {/* ========================== */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    disabled={isEdit}
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="password"
                    label={isEdit ? "Mật khẩu mới (tùy chọn)" : "Mật khẩu"}
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    helperText={
                      isEdit
                        ? "Để trống nếu không đổi mật khẩu"
                        : "Tối thiểu 6 ký tự"
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((p) => !p)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormSection>
        </Grid>

        {/* ROLE + STATUS */}
        <Grid item xs={12}>
          <FormSection title="Phân quyền & Trạng thái">
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                </TextField>
              </Grid>

              {isEdit && (
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  </TextField>
                </Grid>
              )}
            </Grid>
          </FormSection>
        </Grid>
      </Grid>

      <FormSubmitBar
        isEdit={isEdit}
        loading={loading}
        onSubmit={handleSubmit}
        backUrl="/admin/users"
      />
    </Box>
  );
}
