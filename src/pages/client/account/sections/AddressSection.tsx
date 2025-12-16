import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import addressApi from "@/api/addresses";
import type { Address } from "@/api/addresses";
import { alertConfirm, alertError, alertSuccess } from "@/utils/alert";
import { unwrapList } from "@/utils/unwrap";

import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

type FormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; data: Address };

export default function AddressSection() {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formState, setFormState] = useState<FormState>({ mode: "closed" });

  // ======================
  // Load list
  // ======================
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const list = await addressApi.list({ pageSize: 50 }).then(unwrapList);

      setAddresses(list);
    } catch (e: any) {
      alertError(e.message || "Không tải được danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // ======================
  // Handlers
  // ======================
  const handleDelete = async (id: string) => {
    const ok = await alertConfirm(
      "Xóa địa chỉ?",
      "Địa chỉ này sẽ bị xóa khỏi sổ địa chỉ của bạn."
    );
    if (!ok.isConfirmed) return;

    try {
      await addressApi.remove(id);
      alertSuccess("Đã xóa địa chỉ");
      loadAddresses();
    } catch (e: any) {
      alertError(e.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressApi.setDefault(id);
      alertSuccess("Đã đặt làm địa chỉ mặc định");
      loadAddresses();
    } catch (e: any) {
      alertError(e.message);
    }
  };

  const closeForm = () => setFormState({ mode: "closed" });

  // ======================
  // Render
  // ======================
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontWeight={600}>Sổ địa chỉ</Typography>
        <Button
          variant="contained"
          onClick={() => setFormState({ mode: "create" })}
        >
          Thêm địa chỉ
        </Button>
      </Box>

      {/* FORM */}
      {formState.mode !== "closed" && (
        <AddressForm
          initialData={formState.mode === "edit" ? formState.data : null}
          onCancel={closeForm}
          onSuccess={() => {
            alertSuccess("Lưu địa chỉ thành công");
            closeForm();
            loadAddresses();
          }}
        />
      )}

      {/* LIST */}
      {loading ? (
        <Typography color="text.secondary">Đang tải...</Typography>
      ) : addresses.length === 0 ? (
        <Typography color="text.secondary">Bạn chưa có địa chỉ nào</Typography>
      ) : (
        <Grid container spacing={2}>
          {addresses.map((addr) => (
            <Grid item xs={12} md={6} key={addr.id}>
              <AddressCard
                address={addr}
                onEdit={() => setFormState({ mode: "edit", data: addr })}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
