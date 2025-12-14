// components/AddressList.tsx
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { unwrapList } from "@/utils/unwrap";
import { accountService } from "../account.service";
import { alertConfirm, alertSuccess } from "@/utils/alert";
import AddressFormDialog from "./AddressFormDialog";

export default function AddressList() {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const res = await accountService.listAddresses();
    setList(unwrapList(res));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    const ok = await alertConfirm();
    if (!ok.isConfirmed) return;
    await accountService.deleteAddress(id);
    alertSuccess("Đã xóa địa chỉ");
    load();
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Thêm địa chỉ
      </Button>

      {list.map((a) => (
        <Box key={a.id} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography fontWeight={600}>{a.full_name}</Typography>
          <Typography fontSize={13}>
            {a.address_line} – {a.phone}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={() => { setEditing(a); setOpen(true); }}>
              Sửa
            </Button>
            <Button size="small" color="error" onClick={() => remove(a.id)}>
              Xóa
            </Button>
          </Box>
        </Box>
      ))}

      <AddressFormDialog
        open={open}
        data={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSuccess={load}
      />
    </Box>
  );
}
