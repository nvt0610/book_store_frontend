// src/pages/client/account/components/AddressForm.tsx
import { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Checkbox,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
  Paper,
} from "@mui/material";

import { addressApi } from "@/api/addresses";
import { alertError } from "@/utils/alert";
import { validate } from "@/utils/validation";
import { useFormState } from "@/hooks/useFormState";
import { usePhoneField } from "@/hooks/usePhoneField";

export default function AddressForm({
  onCancel,
  onSuccess,
  initialData,
}) {
  const isEdit = Boolean(initialData);
  const [loading, setLoading] = useState(false);

  const { form, setForm, handleChange } = useFormState(initialData, {
    full_name: "",
    phone: "",
    address_line: "",
    address_line2: "",
    postal_code: "",
    is_default: false,
  });

  // ✅ Reuse shared phone logic (10–11 digits)
  const phone = usePhoneField(11);

  // init phone when edit
  useState(() => {
    if (initialData?.phone) {
      phone.setValue(initialData.phone);
    }
  });

  const handleSubmit = async () => {
    try {
      validate.required(form.full_name, "Họ tên người nhận");
      validate.max(form.full_name, 150, "Họ tên người nhận");

      validate.required(phone.value, "Số điện thoại");
      if (phone.value.length < 10 || phone.value.length > 11) {
        throw new Error("Số điện thoại phải có 10–11 chữ số");
      }

      validate.required(form.address_line, "Địa chỉ");

      if (form.postal_code) {
        validate.max(form.postal_code, 20, "Mã bưu điện");
      }

      setLoading(true);

      const payload = {
        full_name: form.full_name.trim(),
        phone: phone.value,
        address_line: form.address_line.trim(),
        address_line2: form.address_line2?.trim() || null,
        postal_code: form.postal_code?.trim() || null,
        is_default: form.is_default || undefined,
      };

      if (isEdit) {
        await addressApi.update(initialData.id, payload);
      } else {
        await addressApi.create(payload);
      }

      onSuccess();
    } catch (err: any) {
      console.error("[AddressForm.submit]", err);
      alertError(err.message || "Không thể lưu địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {isEdit ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Họ tên người nhận"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ maxLength: 150 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Số điện thoại"
            fullWidth
            value={phone.value}
            error={!!phone.error}
            helperText={phone.error || "10–11 chữ số"}
            onChange={(e) => phone.onChange(e.target.value)}
            inputProps={{ maxLength: 11 }}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Địa chỉ"
            name="address_line"
            value={form.address_line}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Địa chỉ bổ sung (tùy chọn)"
            name="address_line2"
            value={form.address_line2}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Mã bưu điện (tùy chọn)"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            fullWidth
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEdit && initialData.is_default ? (
              <Tooltip title="Không thể bỏ mặc định. Vui lòng đặt địa chỉ khác làm mặc định.">
                <span>
                  <Checkbox checked disabled />
                </span>
              </Tooltip>
            ) : (
              <Checkbox
                checked={form.is_default}
                onChange={(e) =>
                  setForm((p) => ({ ...p, is_default: e.target.checked }))
                }
              />
            )}
            <Typography>Đặt làm địa chỉ mặc định</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onCancel} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Lưu"}
        </Button>
      </Box>
    </Paper>
  );
}
