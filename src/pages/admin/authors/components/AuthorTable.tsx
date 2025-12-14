// src/pages/admin/authors/components/AuthorTable.tsx
import CrudTable from "@/components/crud/CrudTable";
import { Avatar, Box } from "@mui/material";
import { getThumb } from "@/utils/image";

export default function AuthorTable({
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
          label: "Ảnh",
          width: 80,
          render: (row) => (
            <Avatar
              src={getThumb(row.photo_url)}
              sx={{ width: 42, height: 42 }}
            />
          ),
        },
        {
          label: "Tên tác giả",
          render: (row) => row.name,
        },
        {
          label: "Tiểu sử",
          render: (row) =>
            row.biography
              ? row.biography.slice(0, 60) +
                (row.biography.length > 60 ? "…" : "")
              : "-",
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
