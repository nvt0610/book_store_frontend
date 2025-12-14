import { useEffect, useState } from "react";
import { Box, Grid, TextField, Checkbox, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { userApi } from "@/api/users";
import { addressApi } from "@/api/addresses";

import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";
import { unwrapList, unwrapItem } from "@/utils/unwrap";

import { useFormState } from "@/hooks/useFormState";
import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";
import UserSelectPanel from "@/components/form/UserSelectPanel";

export default function AddressForm({ initialData }: { initialData: any | null }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  // ==========================
  // FORM STATE
  // ==========================
  const { form, setForm, handleChange } = useFormState(initialData, {
    full_name: "",
    phone: "",
    address_line: "",
    address_line2: "",
    postal_code: "",
    is_default: false,
  });

  const [phoneError, setPhoneError] = useState("");

  // ==========================
  // LOAD USER IN EDIT MODE
  // ==========================
  useEffect(() => {
    if (!isEdit) return;
    if (!initialData?.user_id) return;

    const loadUser = async () => {
      try {
        const res = await userApi.getById(initialData.user_id);
        const u = unwrapItem(res);
        setSelectedUser(u.id);
      } catch {
        alertError("Không thể tải thông tin người dùng");
      }
    };

    loadUser();
  }, [isEdit, initialData]);

  // ==========================
  // AUTO-FILL FROM USER
  // ==========================
  const onUserPicked = async (userId: string) => {
    setSelectedUser(userId);

    try {
      const res = await userApi.getById(userId);
      const u = unwrapItem(res);

      setForm((prev) => ({
        ...prev,
        full_name: u.full_name,
        phone: u.phone || "",
      }));
    } catch {
      alertError("Không tải được thông tin user");
    }
  };

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async () => {
    try {
      validate.required(form.full_name, "Họ tên");
      validate.required(form.phone, "Số điện thoại");
      validate.required(form.address_line, "Địa chỉ");
      validate.required(form.postal_code, "Mã vùng");
      validate.max(form.full_name, 150);
      validate.max(form.phone, 20);
      validate.max(form.postal_code, 20);

      if (!isEdit && !selectedUser) {
        alertError("Vui lòng chọn người dùng");
        return;
      }

      setLoading(true);

      if (!isEdit) {
        await addressApi.create({
          user_id: selectedUser,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          address_line: form.address_line.trim(),
          address_line2: form.address_line2.trim() || null,
          postal_code: form.postal_code.trim(),
          is_default: form.is_default,
        });

        alertSuccess("Tạo địa chỉ thành công");
      } else {
        await addressApi.update(initialData.id, {
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          address_line: form.address_line.trim(),
          address_line2: form.address_line2.trim() || null,
          postal_code: form.postal_code.trim(),
        });

        if (form.is_default && !initialData.is_default) {
          await addressApi.setDefault(initialData.id);
        }

        alertSuccess("Cập nhật thành công");
      }

      navigate("/admin/addresses");
    } catch (err: any) {
      alertError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <Box>

      {/* ======================
          USER SELECTION
      ====================== */}
      {!isEdit ? (
        <FormSection title="Chọn người dùng">
          <UserSelectPanel value={selectedUser} onChange={onUserPicked} />
        </FormSection>
      ) : (
        <FormSection title="Người dùng">
          <Typography fontWeight={600}>{initialData.full_name}</Typography>
          <Typography fontSize={14} color="text.secondary">
            {initialData.email}
          </Typography>
        </FormSection>
      )}

      {/* ======================
          ADDRESS INFO FORM
      ====================== */}
      <FormSection title="Thông tin địa chỉ">
        <Grid container spacing={2} mb={1}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Họ tên"
              fullWidth
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <TextField
                label="Số điện thoại"
                fullWidth
                name="phone"
                value={form.phone}
                error={!!phoneError}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  if (e.target.value !== v) {
                    setPhoneError("Chỉ được nhập chữ số");
                  } else {
                    setPhoneError("");
                  }
                  setForm((p) => ({ ...p, phone: v }));
                }}
              />
              {phoneError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ position: "absolute", bottom: -18 }}
                >
                  {phoneError}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              label="Địa chỉ"
              fullWidth
              name="address_line"
              value={form.address_line}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Mã vùng"
              fullWidth
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Địa chỉ bổ sung (tùy chọn)"
              fullWidth
              name="address_line2"
              value={form.address_line2}
              onChange={handleChange}
            />
          </Grid>

          {/* DEFAULT FLAG */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isEdit && initialData.is_default ? (
                <Tooltip title="Không thể bỏ mặc định. Bạn phải đặt địa chỉ khác làm mặc định trước.">
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
      </FormSection>

      {/* ======================
          SUBMIT
      ====================== */}
      <FormSubmitBar
        backUrl="/admin/addresses"
        loading={loading}
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
