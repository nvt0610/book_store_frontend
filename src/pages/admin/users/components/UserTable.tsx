import CrudTable from "@/components/crud/CrudTable";
import { Chip, IconButton, Tooltip } from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

export default function UserTable({
  rows,
  page,
  pageSize,
  total,
  onChangePage,
  onEdit,
  onDelete,
  rowActions,   // từ user.config
  config,       // chứa handler
  refresh,      // callback reload
}) {
  return (
    <CrudTable
      rows={rows}
      page={page}
      pageSize={pageSize}
      total={total}
      onChangePage={onChangePage}
      onEdit={onEdit}
      onDelete={async (id) => {
        await onDelete(id);
        refresh?.();  // ⭐ reload list
      }}
      onRestore={async (id) => {
        await config.onRestore(id);
        refresh?.(); // ⭐ reload list
      }}

      /** ⭐ CHỈ TRUYỀN extraActions — KHÔNG override action column nữa */
      extraActions={(u) =>
        rowActions?.(u)?.map((act) => {
          const handler = config[act.handlerKey];

          const Icon =
            act.icon === "lock" ? LockIcon :
              act.icon === "unlock" ? LockOpenIcon :
                null;

          return (
            <Tooltip key={act.key} title={act.tooltip}>
              <IconButton
                size="small"
                sx={{
                  color:
                    act.color === "warning" ? "#ed6c02"
                      : act.color === "success" ? "#2e7d32"
                        : "#555"
                }}
                onClick={async () => {
                  await handler(u.id, u.status);
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
        { label: "Họ tên", render: (u) => u.full_name },
        { label: "Email", render: (u) => u.email },
        { label: "SĐT", render: (u) => u.phone || "-" },
        {
          label: "Role",
          render: (u) => (
            <Chip size="small"
              label={u.role}
              sx={{
                bgcolor: u.role === "ADMIN" ? "#1976d2" : "#D97826",
                color: "#fff"
              }}
            />
          )
        },
        {
          label: "Trạng thái",
          render: (u) => (
            <Chip size="small"
              label={u.status}
              sx={{
                bgcolor: u.status === "ACTIVE" ? "#4caf50" : "#9e9e9e",
                color: "#fff"
              }}
            />
          )
        },
        {
          label: "Ngày tạo",
          render: (u) =>
            u.created_at ? new Date(u.created_at).toLocaleString() : "-"
        }
      ]}
    />
  );
} 