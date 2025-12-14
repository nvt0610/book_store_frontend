// src/pages/admin/carts/components/CartTable.tsx
import CrudTable from "@/components/crud/CrudTable";
import { Chip } from "@mui/material";

export default function CartTable({
  rows,
  page,
  pageSize,
  total,
  onChangePage,
  onEdit,
  onDelete,
  onRestore,
  showDeleted,
  config,
  refresh,
}) {
  return (
    <CrudTable
      rows={rows}
      total={total}
      page={page}
      pageSize={pageSize}
      onChangePage={onChangePage}
      onEdit={null} // ❌ edit disabled
      onDelete={async (id) => {
        await onDelete(id);
        refresh?.();
      }}
      onRestore={async (id) => {
        await onRestore(id);
        refresh?.();
      }}
      showDeleted={showDeleted}
      extraActions={(row) => {
        return (
          <Chip
            label="Xem"
            color="primary"
            size="small"
            sx={{ cursor: "pointer", ml: 1 }}
            onClick={() => config.onViewCart(row.id)}
          />
        );
      }}
      columns={[
        {
          label: "User",
          render: (row) => row.user_id || "(guest)",
        },
        {
          label: "Token khách",
          render: (row) => row.guest_token || "-",
        },
        {
          label: "Trạng thái",
          render: (row) => row.status,
        },
        {
          label: "Ngày tạo",
          render: (row) => new Date(row.created_at).toLocaleString("vi-VN"),
        },
      ]}
    />
  );
}
