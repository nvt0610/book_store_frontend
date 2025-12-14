import { Button, TextField, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { accountService } from "../account.service";
import { alertSuccess, alertError } from "@/utils/alert";
import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";
import { usePhoneField } from "@/hooks/usePhoneField";
import PasswordChangeForm from "./PasswordChangeForm";

export default function ProfileInfoForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({ full_name: "", phone: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);

  const phone = usePhoneField();

  useEffect(() => {
    accountService.getMe().then((u) => {
      setForm(u);
      phone.setValue(u.phone || "");
    });
  }, []);

  const submit = async () => {
    try {
      setLoading(true);
      await accountService.updateProfile({
        full_name: form.full_name,
        phone: phone.value,
      });
      alertSuccess("Cập nhật thông tin thành công");
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
        />

        <Divider sx={{ my: 2 }} />

        <Button
          variant="outlined"
          onClick={() => setShowChangePassword((p) => !p)}
        >
          {showChangePassword ? "Hủy đổi mật khẩu" : "Đổi mật khẩu"}
        </Button>

        {showChangePassword && <PasswordChangeForm />}
      </FormSection>

      <FormSubmitBar
        backUrl="/"
        loading={loading}
        isEdit
        onSubmit={submit}
      />
    </>
  );
}
