// src/pages/admin/addresses/components/AddressTable.tsx
import CrudTable from "@/components/crud/CrudTable";

export default function AddressTable({
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
      onEdit={onEdit}

      onDelete={async (id) => {
        await onDelete(id);
        refresh?.();
      }}

      onRestore={async (id) => {
        await onRestore(id);
        refresh?.();
      }}

      showDeleted={showDeleted}
      columns={[
        {
          label: "Email",
          render: (row) => row.user_email || "-",
          minWidth: 180,
        },

        { label: "Người nhận", render: (row) => row.full_name },
        { label: "SĐT", render: (row) => row.phone },

        {
          label: "Địa chỉ",
          render: (row) => (
            <div
              style={{
                maxWidth: 260,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.address_line}
            </div>
          ),
        },

        {
          label: "Mặc định",
          align: "center",
          render: (row) =>
            row.is_default ? (
              <span
                style={{
                  background: "#4caf50",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ✔ DEFAULT
              </span>
            ) : (
              "-"
            ),
        },

        {
          label: "Ngày tạo",
          render: (row) =>
            new Date(row.created_at).toLocaleString("vi-VN", {
              hour12: false,
            }),
        },
      ]}
    />
  );
}
