// src/pages/admin/payments/payment.config.tsx
import PaymentForm from "./components/PaymentForm";

export const paymentConfig = {
  title: "Payments",
  subtitle: "Quản lý thanh toán đơn hàng",
  searchPlaceholder: "Tìm theo order_id hoặc payment_ref...",

  disableCreate: true,

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  // ❌ ẨN nút tạo mới hoàn toàn
  createText: null,
  onCreate: null,

  formComponent: PaymentForm,

  // =============================
  // EDIT
  // =============================
  onEdit: (id) => (window.location.href = `/admin/payments/${id}`),

  // =============================
  // DELETE
  // =============================
  deleteCountField: null,
  deleteBlockWhenRelated: false,

  deleteConfirmText(data) {
    return `Bạn có chắc muốn xóa payment #${data.id}?`;
  },

  deleteSuccessText() {
    return "Đã xóa payment thành công.";
  },

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("payments", id);
  },

  renderFilters() {
    return null;
  },
};
