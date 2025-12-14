// src/pages/admin/publishers/publisher.config.tsx
import PublisherForm from "./components/PublisherForm";

export const publisherConfig = {
  title: "Publishers",
  subtitle: "Quản lý nhà xuất bản",
  searchPlaceholder: "Tìm theo tên, địa chỉ, website...",

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  formComponent: PublisherForm,
  createText: "Tạo nhà xuất bản mới",

  onCreate: () => (window.location.href = "/admin/publishers/new"),
  onEdit: (id) => (window.location.href = `/admin/publishers/${id}`),

  /// --------------------------------------
  // DELETE RULE FOR PUBLISHERS
  // --------------------------------------
  deleteCountField: "product_count", // backend cần trả product_count
  deleteBlockWhenRelated: true,      // ❗ Không cho xoá nếu còn sách

  deleteBlockText: (data, count) =>
    `Không thể xóa nhà xuất bản "${data.name}".\n` +
    `Hiện có ${count} sách đang thuộc nhà xuất bản này.\n` +
    `Hãy cập nhật hoặc xóa sách trước.`,

  deleteConfirmText: (data) =>
    `Bạn có chắc muốn xoá nhà xuất bản "${data.name}"?\n(Lưu ý: Không thể phục hồi)`,

  deleteSuccessText: () => `Đã xoá nhà xuất bản.`,

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("publishers", id);
  },
};
