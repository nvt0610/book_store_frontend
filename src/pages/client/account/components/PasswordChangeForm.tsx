import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { userApi } from "@/api/users";
import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";

export default function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const submit = async () => {
    try {
      validate.required(form.current_password, "Mật khẩu hiện tại");
      validate.required(form.new_password, "Mật khẩu mới");
      validate.min(form.new_password, 6, "Mật khẩu mới");

      if (form.new_password !== form.confirm_password) {
        throw new Error("Mật khẩu xác nhận không khớp");
      }

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

  return (
    <Box mt={2}>
      <Stack spacing={2}>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          value={form.current_password}
          onChange={(e) =>
            setForm((p) => ({ ...p, current_password: e.target.value }))
          }
        />

        <TextField
          label="Mật khẩu mới"
          type="password"
          value={form.new_password}
          onChange={(e) =>
            setForm((p) => ({ ...p, new_password: e.target.value }))
          }
        />

        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          value={form.confirm_password}
          onChange={(e) =>
            setForm((p) => ({ ...p, confirm_password: e.target.value }))
          }
        />

        <Button
          variant="contained"
          disabled={loading}
          onClick={submit}
        >
          {loading ? "Đang đổi..." : "Đổi mật khẩu"}
        </Button>
      </Stack>
    </Box>
  );
}
