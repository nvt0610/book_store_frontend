import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";

export default function ImageUploadOne({
  label,
  previewUrl,
  onFileSelected,
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openFile = () => fileRef.current?.click();

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("Chỉ hỗ trợ PNG, JPG, JPEG");
      return;
    }

    onFileSelected(file);
  };

  return (
    <Box>
      <Typography fontWeight={600} mb={1}>
        {label}
      </Typography>

      {/* Khung preview */}
      <Box
        sx={{
          width: 140,
          height: 140,
          borderRadius: 2,
          border: "1px solid #ccc",
          bgcolor: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          mb: 1,
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src="/placeholder-user.png"
            style={{ width: 60, opacity: 0.4 }}
          />
        )}
      </Box>

      <Button variant="outlined" onClick={openFile}>
        Upload ảnh
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </Box>
  );
}
interface ImageUploadOneProps 