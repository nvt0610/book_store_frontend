import CrudTable from "@/components/crud/CrudTable";
import { Chip } from "@mui/material";

import { truncate } from "@/utils/text";
import { formatCurrency } from "@/utils/currency";

export default function PaymentTable({
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
    switch (status) {
      case "COMPLETED":
        return <Chip label="COMPLETED" color="success" size="small" />;
      case "PENDING":
        return <Chip label="PENDING" color="warning" size="small" />;
      default:
        return <Chip label="INACTIVE" color="default" size="small" />;
    }
  };

  return (
    <CrudTable
      rows={rows}
      page={page}
      pageSize={pageSize}
      total={total}
      onChangePage={onChangePage}
      onEdit={(id) => {
        const row = rows.find((r) => r.id === id);
        if (!row) return;

        // ⭐ Block edit nếu không phải PENDING
        if (row.status !== "PENDING") return;

        onEdit?.(id);
      }}
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
          label: "Order ID",
          render: (row) => truncate(row.order_id, 18),
          minWidth: 180,
        },
        {
          label: "Method",
          render: (row) => row.payment_method,
        },
        {
          label: "Tổng tiền",
          render: (row) => formatCurrency(row.amount),
        },
        {
          label: "Trạng thái",
          render: (row) => renderStatus(row.status),
        },
        {
          label: "Payment Ref",
          render: (row) => row.payment_ref || "-",
        },
        {
          label: "Ngày tạo",
          render: (row) => new Date(row.created_at).toLocaleString("vi-VN"),
        },
      ]}
    />
  );
}
