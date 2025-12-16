import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";

import addressApi from "@/api/addresses";
import { alertError } from "@/utils/alert";
import { unwrapItem } from "@/utils/unwrap";

type Props = {
  id: string;
  onClose: () => void;
};

export default function AddressDetailDialog({ id, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    addressApi
      .getById(id)
      .then((res) => setAddress(unwrapItem(res)))
      .catch((e) => alertError(e.message || "Không tải được địa chỉ"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi tiết địa chỉ</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Typography color="text.secondary">Đang tải...</Typography>
        ) : !address ? (
          <Typography color="text.secondary">Không tìm thấy địa chỉ</Typography>
        ) : (
          <Stack spacing={1.5}>
            {/* TÊN NGƯỜI NHẬN */}
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                Tên người nhận
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={600} variant="h6">
                  {address.full_name}
                </Typography>

                {address.is_default && (
                  <Chip
                    label="Địa chỉ mặc định"
                    color="primary"
                    size="small"
                    sx={{ width: "fit-content" }}
                  />
                )}
              </Stack>
            </Stack>

            {/* ĐIỆN THOẠI */}
            <Typography>
              <strong>Điện thoại:</strong> {address.phone}
            </Typography>

            {/* ĐỊA CHỈ CHÍNH */}
            <Typography>
              <strong>Địa chỉ:</strong> {address.address_line}
            </Typography>

            {/* ĐỊA CHỈ PHỤ */}
            {address.address_line2 && (
              <Typography>{address.address_line2}</Typography>
            )}

            {/* MÃ BƯU ĐIỆN */}
            {address.postal_code && (
              <Typography>
                <strong>Mã bưu điện:</strong> {address.postal_code}
              </Typography>
            )}

            {/* THỜI GIAN TẠO */}
            <Typography variant="body2" color="text.secondary">
              Tạo lúc:{" "}
              {address.created_at
                ? new Date(address.created_at).toLocaleString()
                : "--"}
            </Typography>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
