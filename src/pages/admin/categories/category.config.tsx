// src/pages/admin/categories/category.config.tsx
import CategoryForm from "./components/CategoryForm";

export const categoryConfig = {
  title: "Categories",
  subtitle: "Quản lý danh mục / thể loại sách",
  searchPlaceholder: "Tìm theo tên hoặc mô tả...",

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  createText: "Tạo category mới",
  formComponent: CategoryForm,

  // =============================
  // CREATE / EDIT
  // =============================
  onCreate: () => (window.location.href = "/admin/categories/new"),
  onEdit: (id) => (window.location.href = `/admin/categories/${id}`),

  // =============================
  // DELETE
  // =============================
  deleteCountField: "product_count",

  deleteConfirmText(data, count) {
    return count > 0
      ? `Danh mục "${data.name}" đang chứa ${count} sản phẩm.\n` +
      `Xóa sẽ làm các sản phẩm này mất category_id.\nBạn chắc chắn chứ?`
      : `Bạn có chắc muốn xóa danh mục "${data.name}"?`;
  },

  deleteSuccessText(detached, data) {
    return detached > 0
      ? `Đã xóa danh mục "${data.name}". ${detached} sản phẩm đã được tách danh mục.`
      : `Đã xóa danh mục "${data.name}".`;
  },
  
  // =============================
  // RESTORE
  // =============================
  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("categories", id);
  },

  // =============================
  // OVERRIDE template filters & sort
  // (để KHÔNG bị show dropdown thừa)
  // =============================
  renderFilters() {
    return null;
  },

  renderSort() {
    return null;
  },
};
