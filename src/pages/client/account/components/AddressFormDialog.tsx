import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { accountService } from "../account.service";
import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";
import { usePhoneField } from "@/hooks/usePhoneField";

export default function AddressFormDialog({
  open,
  data,
  onClose,
  onSuccess,
}: {
  open: boolean;
  data?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const phone = usePhoneField();

  const [form, setForm] = useState<any>({
    full_name: "",
    phone: "",
    address_line: "",
    address_line2: "",
    postal_code: "",
    is_default: false,
  });

  useEffect(() => {
    if (data) {
      setForm(data);
      phone.setValue(data.phone || "");
    }
  }, [data]);

  const submit = async () => {
    try {
      validate.required(form.full_name, "Họ tên");
      validate.required(phone.value, "Số điện thoại");
      validate.phone(phone.value);
      validate.required(form.address_line, "Địa chỉ");

      setLoading(true);

      const payload = {
        ...form,
        phone: phone.value,
      };

      if (data?.id) {
        await accountService.updateAddress(data.id, payload);
        alertSuccess("Đã cập nhật địa chỉ");
      } else {
        await accountService.createAddress(payload);
        alertSuccess("Đã thêm địa chỉ");
      }

      onSuccess();
      onClose();
    } catch (e: any) {
      alertError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {data ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Họ tên người nhận"
          sx={{ mt: 2 }}
          value={form.full_name}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, full_name: e.target.value }))
          }
        />

        <TextField
          fullWidth
          label="Số điện thoại"
          sx={{ mt: 2 }}
          value={phone.value}
          error={!!phone.error}
          helperText={phone.error}
          onChange={(e) => phone.onChange(e.target.value)}
        />

        <TextField
          fullWidth
          label="Địa chỉ"
          sx={{ mt: 2 }}
          value={form.address_line}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, address_line: e.target.value }))
          }
        />

        <TextField
          fullWidth
          label="Địa chỉ phụ"
          sx={{ mt: 2 }}
          value={form.address_line2 || ""}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, address_line2: e.target.value }))
          }
        />

        <TextField
          fullWidth
          label="Mã bưu chính"
          sx={{ mt: 2 }}
          value={form.postal_code || ""}
          onChange={(e) =>
            setForm((p: any) => ({ ...p, postal_code: e.target.value }))
          }
        />

        {!data && (
          <FormControlLabel
            control={
              <Checkbox
                checked={form.is_default}
                onChange={(e) =>
                  setForm((p: any) => ({
                    ...p,
                    is_default: e.target.checked,
                  }))
                }
              />
            }
            label="Đặt làm địa chỉ mặc định"
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          disabled={loading}
          onClick={submit}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
