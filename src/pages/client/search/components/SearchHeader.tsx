import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface Props {
  keyword: string;
  total: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC" | null;
  onSortChange: (v: {
    sortBy: string;
    sortDir: "ASC" | "DESC";
  }) => void;
}

export default function SearchHeader({
  keyword,
  total,
  sortBy,
  sortDir,
  onSortChange,
}: Props) {
  const value =
    sortBy === "price" && sortDir === "ASC"
      ? "price_asc"
      : sortBy === "price" && sortDir === "DESC"
      ? "price_desc"
      : sortBy === "created_at"
      ? "created_desc"
      : "relevance";

  const handleChange = (v: string) => {
    switch (v) {
      case "price_asc":
        onSortChange({ sortBy: "price", sortDir: "ASC" });
        break;
      case "price_desc":
        onSortChange({ sortBy: "price", sortDir: "DESC" });
        break;
      case "created_desc":
        onSortChange({ sortBy: "created_at", sortDir: "DESC" });
        break;
      default:
        onSortChange({ sortBy: "created_at", sortDir: "DESC" });
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Kết quả tìm kiếm{keyword && ` cho "${keyword}"`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {total} sản phẩm
        </Typography>
      </Box>

      <FormControl size="small">
        <Select
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        >
          <MenuItem value="relevance">Liên quan nhất</MenuItem>
          <MenuItem value="created_desc">Mới nhất</MenuItem>
          <MenuItem value="price_asc">Giá tăng dần</MenuItem>
          <MenuItem value="price_desc">Giá giảm dần</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
