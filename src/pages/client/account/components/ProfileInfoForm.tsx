import { Button, TextField, Divider, Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { accountService } from "../account.service";
import { alertSuccess, alertError } from "@/utils/alert";
import FormSection from "@/components/form/FormSection";
import { usePhoneField } from "@/hooks/usePhoneField";
import PasswordChangeForm from "./PasswordChangeForm";

export default function ProfileInfoForm() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<any>({ full_name: "", phone: "" });
  const [originalForm, setOriginalForm] = useState<any>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);

  const phone = usePhoneField();

  useEffect(() => {
    accountService.getMe().then((u) => {
      setForm(u);
      setOriginalForm(u);
      phone.setValue(u.phone || "");
    });
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
    if (originalForm) {
      setForm(originalForm);
      phone.setValue(originalForm.phone || "");
    }
  };

  const submit = async () => {
    try {
      setLoading(true);
      await accountService.updateProfile({
        full_name: form.full_name,
        phone: phone.value,
      });
      alertSuccess("Cập nhật thông tin thành công");
      setIsEditing(false); // Turn off editing mode on success
      setOriginalForm(form); // Update original form to new state
    } catch (e: any) {
      alertError(e.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormSection title="Thông tin cá nhân">
        <TextField
          fullWidth
          label="Họ tên"
          value={form.full_name || ""}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, full_name: e.target.value }))
          }
          sx={{ mb: 2 }}
          disabled={!isEditing}
        />

        <TextField
          fullWidth
          label="Email"
          value={form.email || ""}
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Số điện thoại"
          value={phone.value}
          error={!!phone.error}
          helperText={phone.error}
          onChange={(e) => phone.onChange(e.target.value)}
          disabled={!isEditing}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          {!isEditing ? (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Sửa
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Hủy
              </Button>
              <Button variant="contained" onClick={submit} disabled={loading}>
                {loading ? "Đang lưu..." : "Xác nhận"}
              </Button>
            </Stack>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          variant="outlined"
          onClick={() => setShowChangePassword((p) => !p)}
        >
          {showChangePassword ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
        </Button>

        {showChangePassword && <PasswordChangeForm />}
      </FormSection>
    </>
  );
}
