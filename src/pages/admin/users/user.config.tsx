export const userConfig = {
  title: "Users",
  subtitle: "Quản lý tài khoản người dùng",

  searchPlaceholder: "Tìm theo tên, email, số điện thoại...",
  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  createText: "Tạo user mới",
  onCreate: () => (window.location.href = "/admin/users/new"),
  onEdit: (id) => (window.location.href = `/admin/users/${id}`),

  deleteConfirmText(data) {
    return `Bạn có chắc muốn xóa user "${data.full_name}"?`;
  },

  deleteSuccessText() {
    return "Đã xóa user thành công.";
  },

  async onToggleStatus(id, status) {
    const { userApi } = await import("@/api/users");
    const newStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await userApi.updateStatus(id, newStatus);
  },

  // 🔥 CUSTOM ACTION (điểm mới)
  rowActions: (row) => [
    {
      key: "toggle",
      icon: row.status === "ACTIVE" ? "lock" : "unlock",
      color: row.status === "ACTIVE" ? "warning" : "success",
      tooltip: row.status === "ACTIVE" ? "Khóa user" : "Mở khóa user",
      handlerKey: "onToggleStatus", // dùng config.onToggleStatus
    }
  ],

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("users", id);
  },

  renderSort(_sortBy, sortDir, _sb, setSortDir) {
    return (
      <select
        value={sortDir}
        onChange={(e) => setSortDir(e.target.value)}
      >
        <option value="DESC">Ngày tạo mới nhất</option>
        <option value="ASC">Ngày tạo cũ nhất</option>
      </select>
    );
  },
};
