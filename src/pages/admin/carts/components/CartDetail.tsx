// src/pages/admin/carts/components/CartDetail.tsx
import { Box, Typography, Card, CardContent, Table, TableRow, TableCell, TableHead, TableBody } from "@mui/material";

export default function CartDetail({ initialData }) {
  if (!initialData) return null;

  const items = initialData.items || [];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Chi tiết giỏ hàng
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography><strong>ID:</strong> {initialData.id}</Typography>
          <Typography><strong>User:</strong> {initialData.user_id || "(guest)"}</Typography>
          <Typography><strong>Status:</strong> {initialData.status}</Typography>
          <Typography><strong>Created:</strong> {new Date(initialData.created_at).toLocaleString("vi-VN")}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} mb={1}>
        Items
      </Typography>

      <Card>
        <CardContent>
          {items.length === 0 ? (
            <Typography color="text.secondary">Không có sản phẩm.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Số lượng</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>{it.product_id}</TableCell>
                    <TableCell>{it.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
