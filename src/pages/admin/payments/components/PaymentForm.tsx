import { useEffect } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { alertError, alertSuccess } from "@/utils/alert";
import { paymentApi } from "@/api/payments";
import { validate } from "@/utils/validation";

import { useFormState } from "@/hooks/useFormState";
import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";

const METHODS = ["COD", "CREDIT_CARD", "VNPAY", "MOMO"];

const formatCurrency = (value: any) => {
  if (value === null || value === undefined) return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("vi-VN") + " đ";
};

export default function PaymentForm({ initialData }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  // Payment không có chế độ tạo → nếu vào create thì redirect
  useEffect(() => {
    if (!isEdit) navigate("/admin/payments");
  }, [isEdit, navigate]);

  const { form, setForm } = useFormState(initialData, {
    order_id: "",
    payment_method: "COD",
    amount: "",
    payment_ref: "",
  });

  const handleSubmit = async () => {
    try {
      validate.uuid(form.order_id, "Order ID");

      await paymentApi.update(initialData.id, {
        payment_method: form.payment_method,
        payment_ref: form.payment_ref,
      });

      alertSuccess("Cập nhật payment thành công");
      navigate("/admin/payments");
    } catch (err: any) {
      alertError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <Box>
      <FormSection title="Chi tiết thanh toán">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField disabled label="Order ID" fullWidth value={form.order_id} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Phương thức thanh toán"
              name="payment_method"
              fullWidth
              value={form.payment_method}
              onChange={(e) =>
                setForm((p) => ({ ...p, payment_method: e.target.value }))
              }
              SelectProps={{ native: true }}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled
              label="Số tiền"
              fullWidth
              value={formatCurrency(form.amount)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Mã tham chiếu"
              fullWidth
              value={form.payment_ref}
              onChange={(e) =>
                setForm((p) => ({ ...p, payment_ref: e.target.value }))
              }
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSubmitBar
        backUrl="/admin/payments"
        loading={false}
        isEdit={true}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
