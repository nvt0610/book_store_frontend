import CrudTable from "@/components/crud/CrudTable";
import { Avatar, Chip, IconButton, Tooltip } from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { getThumb } from "@/utils/image";
import { formatCurrency } from "@/utils/currency";

export default function ProductTable({
  rows,
  page,
  pageSize,
  total,
  onChangePage,
  onEdit,
  onDelete,
  onRestore,
  rowActions,
  config,
  refresh,
  showDeleted,
}) {
  return (
    <CrudTable
      rows={rows}
      page={page}
      pageSize={pageSize}
      total={total}
      onChangePage={onChangePage}
      onEdit={onEdit}
      showDeleted={showDeleted}
      onDelete={async (id) => {
        await onDelete(id);
        refresh?.();
      }}
      onRestore={async (id) => {
        await onRestore(id);
        refresh?.();
      }}
      /** ⭐ Extra actions (toggle status) */
      extraActions={(p) =>
        rowActions?.(p)?.map((act) => {
          const handler = config[act.handlerKey];
          const Icon =
            act.icon === "lock"
              ? LockIcon
              : act.icon === "unlock"
              ? LockOpenIcon
              : null;

          return (
            <Tooltip key={act.key} title={act.tooltip}>
              <IconButton
                size="small"
                sx={{
                  color:
                    act.color === "warning"
                      ? "#ed6c02"
                      : act.color === "success"
                      ? "#2e7d32"
                      : "#555",
                }}
                onClick={async () => {
                  await handler(p.id, p.status);
                  refresh?.();
                }}
              >
                {Icon && <Icon fontSize="small" />}
              </IconButton>
            </Tooltip>
          );
        })
      }
      columns={[
        {
          label: "Ảnh",
          width: 70,
          render: (p) => (
            <Avatar
              src={getThumb(p.main_image)}
              sx={{ width: 42, height: 42 }}
            />
          ),
        },
        {
          label: "Tên sản phẩm",
          render: (p) => p.name,
        },
        {
          label: "Giá",
          align: "left",
          render: (p) => formatCurrency(p.price),
        },
        {
          label: "Tồn kho",
          align: "left",
          render: (p) => p.stock,
        },
        {
          label: "Trạng thái",
          render: (p) => (
            <Chip
              size="small"
              label={p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
              sx={{
                bgcolor: p.status === "ACTIVE" ? "#4caf50" : "#9e9e9e",
                color: "#fff",
              }}
            />
          ),
        },
        {
          label: "Ngày tạo",
          render: (p) =>
            p.created_at ? new Date(p.created_at).toLocaleString() : "-",
        },
      ]}
    />
  );
}
