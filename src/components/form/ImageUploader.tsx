import { Avatar, Box, Button, Typography } from "@mui/material";

export default function ImageUploader({
  label = "Ảnh",
  preview,
  onUpload,
}: {
  label?: string;
  preview: string;
  onUpload: (file: File) => void;
}) {
  return (
    <Box textAlign="center">
      <Typography fontWeight={600}>{label}</Typography>

      <Avatar
        src={preview}
        variant="rounded"
        sx={{ width: 180, height: 180, margin: "12px auto" }}
      />

      <Button variant="outlined" component="label">
        Chọn ảnh
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
      </Button>

      <Typography variant="body2" color="text.secondary">
        PNG / JPG / JPEG / WEBP
      </Typography>
    </Box>
  );
}
