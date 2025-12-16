import { Chip } from "@mui/material";

export default function OrderStatusChip({
  status,
}: {
  status: "PENDING" | "COMPLETED" | "INACTIVE";
}) {
  const map: Record<string, any> = {
    PENDING: { color: "warning", label: "Đang xử lý" },
    COMPLETED: { color: "success", label: "Hoàn tất" },
    INACTIVE: { color: "default", label: "Đã hủy" },
  };

  const cfg = map[status] || { color: "default", label: status };

  return <Chip size="small" color={cfg.color} label={cfg.label} />;
}
