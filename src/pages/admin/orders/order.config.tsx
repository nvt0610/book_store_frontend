// src/pages/admin/orders/order.config.tsx

import OrderForm from "./components/OrderForm";

export const orderConfig = {
  title: "Orders",
  subtitle: "Quản lý đơn hàng",
  searchPlaceholder: "Tìm theo user, trạng thái...",

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  formComponent: OrderForm,
  createText: "Tạo đơn hàng thủ công",

  // MOVE: chuyển đến form
  onCreate: () => (window.location.href = "/admin/orders/new"),
  onEdit: (id) => (window.location.href = `/admin/orders/${id}`),

  // --------------------------------------
  // DELETE RULE (Order CHỈ XOÁ KHI PENDING)
  // --------------------------------------
  deleteBlockWhenRelated: true,
  deleteBlockText: (data) =>
    `Không thể xoá đơn hàng ${data.id} vì trạng thái hiện tại: ${data.status}. Chỉ xoá khi PENDING.`,

  deleteConfirmText: (data) =>
    `Bạn có chắc muốn xoá đơn hàng ID = ${data.id}?`,
  deleteSuccessText: () => `Đã xoá đơn hàng.`,

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("orders", id);
  },
};
