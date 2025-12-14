import { Box, Checkbox, Avatar, Typography } from "@mui/material";

export default function ProductSelectGrid({
  items,
  selected,
  onToggle,
  showPrice = true,
  showStock = true,
}: {
  items: any[];
  selected: string[];
  onToggle: (item: any) => void;
  showPrice?: boolean;
  showStock?: boolean;
}) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {items.map((p) => (
        <Box
          key={p.id}
          sx={{
            width: 250,
            p: 1.5,
            display: "flex",
            gap: 1.5,
            border: "1px solid #ddd",
            borderRadius: 2,
            alignItems: "center",
          }}
        >
          <Checkbox checked={selected.includes(p.id)} onChange={() => onToggle(p)} />

          <Avatar src={p.main_image} sx={{ width: 46, height: 46 }} />

          <Box>
            <Typography fontWeight={600} sx={{ fontSize: 14 }}>
              {p.name}
            </Typography>

            {showStock && (
              <Typography fontSize={12}>Tồn kho: {p.stock}</Typography>
            )}

            {showPrice && (
              <Typography fontSize={12} color="text.secondary">
                Giá: {(Number(p.price) || 0).toLocaleString("vi-VN")} đ
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
