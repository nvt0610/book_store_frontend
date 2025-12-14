// src/pages/admin/addresses/address.config.tsx
import AddressForm from "./components/AddressForm";

export const addressConfig = {
  title: "Addresses",
  subtitle: "Quản lý địa chỉ giao hàng của người dùng",
  searchPlaceholder: "Tìm theo tên, số điện thoại hoặc địa chỉ...",

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  createText: "Tạo địa chỉ mới",
  formComponent: AddressForm,

  // =============================
  // CREATE / EDIT
  // =============================
  onCreate: () => (window.location.href = "/admin/addresses/new"),
  onEdit: (id) => (window.location.href = `/admin/addresses/${id}`),

  // =============================
  // DELETE
  // =============================
  deleteConfirmText(data) {
    return `Bạn có chắc muốn xóa địa chỉ "${data.full_name}"?`;
  },

  deleteSuccessText() {
    return "Xóa thành công.";
  },

  // =============================
  // RESTORE
  // =============================
  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("addresses", id);
  },

  // =============================
  // FILTERS — KHÔNG cần filter tùy biến
  // =============================
  renderFilters() {
    return null;
  },
};
    