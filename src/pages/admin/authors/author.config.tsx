// src/pages/admin/authors/author.config.tsx
import AuthorForm from "./components/AuthorForm";

export const authorConfig = {
  title: "Authors",
  subtitle: "Quản lý tác giả sách",
  searchPlaceholder: "Tìm theo tên hoặc tiểu sử...",

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  formComponent: AuthorForm,
  createText: "Tạo tác giả mới",

  onCreate: () => {
    window.location.href = "/admin/authors/new";
  },

  onEdit: (id) => {
    window.location.href = `/admin/authors/${id}`;
  },

  /// --------------------------------------
  // DELETE RULE FOR AUTHORS
  // --------------------------------------
  deleteCountField: "product_count", // backend cần trả product_count
  deleteBlockWhenRelated: true,      // ❗ Không cho xoá nếu còn sách

  deleteBlockText: (data, count) =>
    `Không thể xóa tác giả "${data.name}".\n` +
    `Hiện có ${count} sách đang thuộc tác giả này.\n` +
    `Hãy cập nhật hoặc xóa sách trước.`,

  deleteConfirmText: (data) =>
    `Bạn có chắc muốn xoá tác giả "${data.name}"?\n(Lưu ý: Không thể phục hồi)`,

  deleteSuccessText: () => `Đã xoá tác giả.`,

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("authors", id);
  },
};
