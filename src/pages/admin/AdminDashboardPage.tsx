// src/pages/admin/AdminDashboardPage.tsx
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/api/dashboard";
import type { DashboardSummary } from "@/api/dashboard";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    dashboardApi.getSummary().then(setData).catch(console.error);
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  const stats = [
    { label: "Total Users", value: data.total_users, icon: <PeopleIcon />, color: "#3f51b5" },
    { label: "Products", value: data.total_products, icon: <InventoryIcon />, color: "#009688" },
    { label: "Orders", value: data.total_orders, icon: <ShoppingBagIcon />, color: "#ff9800" },
    { label: "Revenue", value: data.revenue_this_month.toLocaleString("vi-VN") + " đ", icon: <TrendingUpIcon />, color: "#e91e63" },
  ];

  const renderStatus = (status: string) => {
    const map = {
      PENDING: { color: "warning", label: "Chờ xử lý" },
      COMPLETED: { color: "success", label: "Hoàn tất" },
      INACTIVE: { color: "default", label: "Đã hủy" },
    };
    const cfg = map[status] || { color: "default", label: status };
    return <Chip size="small" label={cfg.label} color={cfg.color as any} />;
  };

  const formatCurrency = (v: any) =>
    (Number(v) || 0).toLocaleString("vi-VN") + " đ";

  return (
    <Box>
      {/* TITLE */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard Overview
      </Typography>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3}>
        {stats.map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: s.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                    }}
                  >
                    {s.icon}
                  </Box>

                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SPACER */}
      <Box mt={5} />

      {/* LATEST ORDERS TABLE */}
      <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Hóa đơn mới nhất
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Mã đơn</strong></TableCell>
                <TableCell><strong>Tổng tiền</strong></TableCell>
                <TableCell><strong>Ngày đặt</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell align="center"><strong>Xem</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.latest_orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" style={{ padding: 20 }}>
                    Không có đơn hàng đang chờ xử lý.
                  </TableCell>
                </TableRow>
              )}

              {data.latest_orders.map((o) => (
                <TableRow
                  key={o.id}
                  sx={{
                    bgcolor: o.status === "PENDING" ? "#fff7e0" : "inherit",
                    transition: "0.15s",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                >
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{formatCurrency(o.total_amount)}</TableCell>
                  <TableCell>
                    {o.created_at ? new Date(o.created_at).toLocaleString("vi-VN") : "-"}
                  </TableCell>
                  <TableCell>{renderStatus(o.status)}</TableCell>

                  {/* Xem chi tiết */}
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết đơn hàng">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
