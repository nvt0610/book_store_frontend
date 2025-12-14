import { Stack, Typography } from "@mui/material";

export default function ProductMeta({
  category,
  author,
  publisher,
}: {
  category?: any;
  author?: any;
  publisher?: any;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        Danh mục: <b>{category?.name || "-"}</b>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Tác giả: <b>{author?.name || "-"}</b>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Nhà xuất bản: <b>{publisher?.name || "-"}</b>
      </Typography>
    </Stack>
  );
}
