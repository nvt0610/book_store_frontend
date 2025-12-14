// src/pages/admin/publishers/components/PublisherTable.tsx
import CrudTable from "@/components/crud/CrudTable";
import { Avatar } from "@mui/material";
import { getThumb } from "@/utils/image";

export default function PublisherTable({
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
  return (
    <CrudTable
      rows={rows}
      page={page}
      pageSize={pageSize}
      total={total}
      onChangePage={onChangePage}
      showDeleted={showDeleted}
      onEdit={onEdit}
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
          label: "Logo",
          width: 80,
          render: (row) => (
            <Avatar
              src={getThumb(row.logo_url)}
              sx={{ width: 42, height: 42 }}
            />
          ),
        },
        {
          label: "Tên NXB",
          render: (row) => row.name,
        },
        {
          label: "Địa chỉ",
          render: (row) => row.address || "-",
        },
        {
          label: "Website",
          render: (row) => row.website || "-",
        },
        {
          label: "Ngày tạo",
          render: (row) =>
            row.created_at ? new Date(row.created_at).toLocaleString() : "-",
        },
      ]}
    />
  );
}
