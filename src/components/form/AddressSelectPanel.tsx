import { Box, Typography, Radio, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addressApi } from "@/api/addresses";
import { unwrapList } from "@/utils/unwrap";
import { alertError } from "@/utils/alert";

export default function AddressSelectPanel({
  userId,
  value,
  onChange,
}: {
  userId: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await addressApi.list({ user_id: userId, pageSize: 500 });
        setList(unwrapList(res));
      } catch {
        alertError("Không tải được địa chỉ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // =========================
  // EMPTY STATE
  // =========================
  if (!loading && list.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography fontWeight={600} mb={1}>
          Chưa có địa chỉ giao hàng
        </Typography>

        <Typography fontSize={13} color="text.secondary" mb={2}>
          Vui lòng tạo địa chỉ mới để tiếp tục thanh toán
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/me/addresses")}
        >
          Thêm địa chỉ mới
        </Button>
      </Box>
    );
  }

  // =========================
  // LIST
  // =========================
  return (
    <Box sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography fontWeight={600}>Chọn địa chỉ</Typography>

        <Button
          size="small"
          onClick={() => navigate("/me/addresses")}
        >
          + Thêm địa chỉ
        </Button>
      </Stack>

      <Box
        sx={{
          maxHeight: 280,
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: 1,
        }}
      >
        {list.map((a) => (
          <Box
            key={a.id}
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #eee",
              display: "flex",
              gap: 2,
              cursor: "pointer",
              bgcolor: value === a.id ? "#f5f8ff" : "transparent",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
            onClick={() => onChange(a.id)}
          >
            <Radio checked={value === a.id} />

            <Box>
              <Typography fontWeight={600}>{a.full_name}</Typography>
              <Typography fontSize={13}>
                {a.address_line} – {a.phone}
              </Typography>

              {a.is_default && (
                <Typography fontSize={12} color="success.main">
                  Mặc định
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
