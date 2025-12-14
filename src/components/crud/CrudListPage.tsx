// src/components/crud/CrudListPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "./SearchBar";
import { alertError } from "@/utils/alert";
import { unwrapList, unwrapMeta } from "@/utils/unwrap";
import { alertConfirm, alertSuccess } from "@/utils/alert";

async function smartDelete(config, api, id) {
  const res = await api.getById(id);
  const data = res?.data?.data || {};

  const countField = config.deleteCountField || "product_count";
  const count = data[countField] ?? 0;

  // ⭐ BLOCK DELETE nếu cấu hình yêu cầu
  if (config.deleteBlockWhenRelated && count > 0) {
    const msg = config.deleteBlockText
      ? config.deleteBlockText(data, count)
      : `"${data.name}" đang có dữ liệu liên quan nên không thể xoá.`;

    alertError(msg);
    return; // ❗ STOP HERE — KHÔNG XOÁ
  }

  // ⭐ Confirm text
  const confirmText = config.deleteConfirmText
    ? config.deleteConfirmText(data, count)
    : `Bạn có chắc muốn xóa "${data.name || "bản ghi"}"?`;

  const confirm = await alertConfirm("Xóa dữ liệu?", confirmText);
  if (!confirm.isConfirmed) return;

  // ⭐ Cho phép xóa
  const delRes = await api.remove(id);
  const detached = delRes?.data?.data?.detachedCount ?? 0;

  const successText = config.deleteSuccessText
    ? config.deleteSuccessText(detached, data)
    : "Xóa thành công.";

  alertSuccess(successText);
}

export default function CrudListPage({ config, api, TableComponent }) {
  const {
    title,
    subtitle,
    searchPlaceholder = "Tìm kiếm...",
    pageSize = 10,
    defaultSortBy = "created_at",
    defaultSortDir = "DESC",
    onCreate,
  } = config;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState(defaultSortDir);

  // Soft delete + sort
  const [filters, setFilters] = useState({
    showDeleted: "active",
    sortCreatedAt: "desc", // 🔥 new
  });

  const fetchData = async (opts = {}) => {
    const nextPage = opts.page !== undefined ? opts.page : page;
    const nextSearch = opts.q !== undefined ? opts.q : search;

    try {
      setLoading(true);

      const res = await api.list({
        page: nextPage,
        pageSize,
        q: nextSearch || undefined,
        sortBy: "created_at",
        sortDir: filters.sortCreatedAt === "desc" ? "DESC" : "ASC",
        ...filters,
      });

      const data = unwrapList(res);
      const meta = unwrapMeta(res);

      setRows(Array.isArray(data) ? data : []);
      setTotal(meta?.total ?? 0);
      setPage(meta?.page ?? nextPage);
    } catch (err) {
      alertError(err?.response?.data?.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchData({ page: 1 });
  }, [filters]);

  const handleSearch = () => fetchData({ page: 1, q: search });

  const handleChangePage = (_, newPage) => {
    fetchData({ page: newPage + 1 });
  };

  return (
    <Box>
      {/* HEADER */}
      <Box
        mb={3}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => fetchData()}>
            <RefreshIcon />
          </IconButton>

          {!config.disableCreate && config.onCreate && (
            <Button variant="contained" onClick={config.onCreate}>
              {config.createText}
            </Button>
          )}
        </Box>
      </Box>

      {/* BODY */}
      <Card>
        <CardContent>
          {/* FILTER BAR */}
          <Box
            mb={2}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: "space-between",
            }}
          >
            {/* LEFT */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={handleSearch}
                placeholder={searchPlaceholder}
              />

              {config.renderFilters?.(filters, setFilters)}
            </Box>

            {/* RIGHT */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {/* 🔥 Sort theo ngày tạo */}
              <TextField
                select
                size="small"
                label="Ngày tạo"
                value={filters.sortCreatedAt}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortCreatedAt: e.target.value,
                  }))
                }
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="desc">Mới nhất</MenuItem>
                <MenuItem value="asc">Cũ nhất</MenuItem>
              </TextField>

              {/* 🔥 Filter trạng thái */}
              <TextField
                select
                size="small"
                label="Trạng thái"
                value={filters.showDeleted}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    showDeleted: e.target.value,
                  }))
                }
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="deleted">Đã xoá</MenuItem>
                <MenuItem value="all">Tất cả</MenuItem>
              </TextField>
            </Box>
          </Box>

          {/* TABLE */}
          <Box sx={{ minHeight: 240 }}>
            {loading ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableComponent
                rows={rows}
                total={total}
                page={page - 1}
                pageSize={pageSize}
                onChangePage={handleChangePage}
                onEdit={!config.disableEdit ? config.onEdit : null}
                onDelete={
                  !config.disableDelete
                    ? (id) => smartDelete(config, api, id)
                    : null
                }
                onRestore={!config.disableRestore ? config.onRestore : null}
                config={config}
                rowActions={
                  config.rowActions
                    ? (row) => {
                        const actions = config.rowActions(row) || [];

                        return actions.filter((a) => {
                          if (a.key === "edit" && config.disableEdit)
                            return false;
                          if (a.key === "delete" && config.disableDelete)
                            return false;
                          if (a.key === "restore" && config.disableRestore)
                            return false;
                          return true;
                        });
                      }
                    : null
                }
                showDeleted={filters.showDeleted} // 🔥 AND THIS
                refresh={() => fetchData({ page })}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
