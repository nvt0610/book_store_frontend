// src/components/crud/CrudTable.tsx
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

interface Column<T> {
  label: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
  minWidth?: number | string;
}

interface CrudTableProps<T> {
  rows: T[];
  columns: Column<T>[];

  page: number;
  pageSize: number;
  total: number;

  onChangePage: (event: unknown, newPage: number) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;

  showDeleted?: "active" | "deleted" | "all";
  extraActions?: (row: T) => React.ReactNode;
}

export default function CrudTable<T>({
  rows,
  columns,
  page,
  pageSize,
  total,
  onChangePage,
  onEdit,
  onDelete,
  onRestore,
  showDeleted,
  extraActions,
}: CrudTableProps<T>) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell
                key={i}
                align={col.align || "left"}
                sx={{
                  width: col.width,
                  minWidth: col.minWidth || 140,
                  fontWeight: 600,
                }}
              >
                {col.label}
              </TableCell>
            ))}

            <TableCell align="right" sx={{ minWidth: 140, fontWeight: 600 }}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {safeRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Typography textAlign="center" color="text.secondary" py={3}>
                  Không có dữ liệu.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            safeRows.map((row: any) => {
              const isDeleted = !!row.deleted_at;

              return (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    height: 48,
                    bgcolor: isDeleted ? "#f3f3f3" : "inherit",
                  }}
                >
                  {columns.map((col, i) => {
                    const value = col.render(row);
                    const showBadge = isDeleted && i === 0;

                    return (
                      <TableCell key={i} align={col.align || "left"}>
                        <Box
                          sx={{
                            maxWidth: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {value}

                          {showBadge && (
                            <Tooltip
                              title={`Đã xoá lúc: ${new Date(
                                row.deleted_at
                              ).toLocaleString()}`}
                            >
                              <Chip
                                label="ĐÃ XOÁ"
                                size="small"
                                sx={{
                                  bgcolor: "#e53935",
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  height: 24,
                                  borderRadius: "6px",
                                  px: "6px",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    );
                  })}

                  {/* ACTIONS */}
                  <TableCell align="right">
                    {/* ⭐ ACTIVE MODE (edit + delete) */}
                    {!isDeleted && (
                      <>
                        {onEdit && (
                          <Tooltip title="Sửa">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row.id)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* EXTRA ACTIONS (luôn hiển thị nếu có) */}
                        {!isDeleted && extraActions && extraActions(row)}

                        {onDelete && (
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(row.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    )}

                    {/* ⭐ DELETED MODE (chỉ show Restore) */}
                    {isDeleted && onRestore && (
                      <Tooltip title="Khôi phục">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onRestore(row.id)}
                          sx={{ bgcolor: "#e3f2fd" }}
                        >
                          <RestoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </Box>
  );
}
