import CrudTable from "@/components/crud/CrudTable";
import { Chip, Tooltip } from "@mui/material";

import { truncate } from "@/utils/text";
import { copyToClipboard } from "@/utils/copy";
import { formatCurrency } from "@/utils/currency";

export default function OrderTable({
  rows,
  page,
  pageSize,
  total,
  onChangePage,
  onEdit,
  onDelete,
  onRestore,
  showDeleted,
  refresh,
}) {
  const renderStatus = (status: string) => {
    const map: Record<string, any> = {
      PENDING: { color: "warning", label: "PENDING" },
      COMPLETED: { color: "success", label: "COMPLETED" },
      INACTIVE: { color: "default", label: "INACTIVE" },
    };
    const cfg = map[status] || { color: "default", label: status };
    return <Chip size="small" label={cfg.label} color={cfg.color} />;
  };

  return (
    <CrudTable
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      onChangePage={onChangePage}
      onEdit={onEdit}
      canEditRow={(row) => row.status === "PENDING"}
      showDeleted={showDeleted}
      onDelete={async (id) => {
        await onDelete(id);
        refresh?.();
      }}
      onRestore={async (id) => {
        await onRestore(id);
        refresh?.();
      }}
      columns={[
        {
          label: "Mã đơn",
          minWidth: 160,
          render: (row) => (
            <Tooltip title={row.id} placement="bottom-start">
              <span
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                }}
                onDoubleClick={() => copyToClipboard(row.id)}
              >
                {truncate(row.id)}
              </span>
            </Tooltip>
          ),
        },

        {
          label: "User",
          minWidth: 160,
          render: (row) => (
            <Tooltip title={row.user_id} placement="bottom-start">
              <span
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                }}
                onDoubleClick={() => copyToClipboard(row.user_id)}
              >
                {truncate(row.user_id)}
              </span>
            </Tooltip>
          ),
        },

        {
          label: "Tổng tiền",
          render: (row) => formatCurrency(row.total_amount),
        },

        {
          label: "Số lượng SP",
          render: (row) => row.total_quantity ?? 0,
        },

        {
          label: "Trạng thái",
          render: (row) => renderStatus(row.status),
        },

        {
          label: "Ngày đặt",
          render: (row) =>
            row.placed_at
              ? new Date(row.placed_at).toLocaleString("vi-VN")
              : "-",
        },
      ]}
    />
  );
}
