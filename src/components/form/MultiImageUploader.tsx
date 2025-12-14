import { Box, Avatar, IconButton, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MultiImageUploader({
  images,
  onUpload,
  onRemove,
}: {
  images: string[];
  onUpload: (files: File[]) => void;
  onRemove: (url: string) => void;
}) {
  return (
    <Box>
      <Typography fontWeight={600}>Ảnh phụ</Typography>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 1,
          p: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          maxWidth: 260,
        }}
      >
        {images.map((img) => (
          <Box key={img} sx={{ position: "relative" }}>
            <Avatar src={img} variant="rounded" sx={{ width: 60, height: 60 }} />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "white",
                border: "1px solid #ccc",
              }}
              onClick={() => onRemove(img)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Button variant="outlined" component="label">
          Thêm ảnh
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => onUpload(Array.from(e.target.files || []))}
          />
        </Button>
      </Box>
    </Box>
  );
}
