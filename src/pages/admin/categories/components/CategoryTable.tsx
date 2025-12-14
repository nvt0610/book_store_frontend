// src/pages/admin/categories/components/CategoryTable.tsx
import CrudTable from "@/components/crud/CrudTable";

export default function CategoryTable({
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

      // ⭐ EDIT
      onEdit={onEdit}

      // ⭐ DELETE + reload
      onDelete={async (id) => {
        await onDelete(id);
        refresh?.();
      }}

      // ⭐ RESTORE + reload
      onRestore={async (id) => {
        await onRestore(id);
        refresh?.();
      }}

      showDeleted={showDeleted}

      columns={[
        { label: "Tên danh mục", render: (row) => row.name },
        { label: "Mô tả", render: (row) => row.description || "-" },
        {
          label: "Số sản phẩm",
          align: "center",
          render: (row) => (
            <span
              style={{
                background: "#eee",
                padding: "3px 8px",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              {row.product_count || 0}
            </span>
          ),
        },
        {
          label: "Ngày tạo",
          render: (row) => new Date(row.created_at).toLocaleString(),
        },
      ]}
    />
  );
}
