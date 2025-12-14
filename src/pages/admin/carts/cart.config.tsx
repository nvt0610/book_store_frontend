// src/pages/admin/carts/cart.config.tsx
import CartDetail from "./components/CartDetail";

export const cartConfig = {
  title: "Carts",
  subtitle: "Danh sách giỏ hàng của khách / người dùng",
  searchPlaceholder: "Tìm theo user_id hoặc guest_token...",

  disableCreate: true,
  disableEdit: true,

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  // ❌ Không có create button
  createText: null,
  onCreate: null,

  formComponent: CartDetail,

  // EDIT — vẫn cần để CrudTable nhận nhưng bạn disable bằng disableEdit
  onEdit: (id) => (window.location.href = `/admin/carts/${id}`),

  // DELETE
  deleteCountField: null,
  deleteBlockWhenRelated: false,

  deleteConfirmText(data) {
    return `Bạn có chắc muốn xóa giỏ hàng #${data.id}?`;
  },

  deleteSuccessText() {
    return "Đã xóa giỏ hàng thành công.";
  },

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("carts", id);
  },

  // ⭐ CUSTOM ACTIONS
  rowActions: (row) => [
    {
      key: "view",
      icon: "eye",
      color: "primary",
      tooltip: "Xem chi tiết giỏ hàng",
      handlerKey: "onViewCart",
    }
  ],

  // ⭐ HANDLER
  async onViewCart(id) {
    window.location.href = `/admin/carts/${id}`;
  },

  renderFilters() {
    return null;
  },
};
