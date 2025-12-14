import { useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { getLarge, getThumb, getOriginal } from "@/utils/image";
import { NO_IMAGE_PLACEHOLDER } from "@/utils/imagePlaceholder";

export default function ProductGallery({ images = [] as string[] }) {
  const safeImages = useMemo(() => {
    const arr = Array.isArray(images) ? images.filter(Boolean) : [];
    return arr.length ? arr : [NO_IMAGE_PLACEHOLDER];
  }, [images]);

  const hasMultiple = safeImages.length > 1;
  const [active, setActive] = useState(0);

  const mainSrc = useMemo(() => {
    const url = safeImages[active];
    return url === NO_IMAGE_PLACEHOLDER ? url : getLarge(url);
  }, [safeImages, active]);

  return (
    <Box>
      {/* Main image */}
      <Box
        sx={{
          width: "100%",
          height: 520,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="img"
          src={mainSrc}
          alt="product"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Thumbnails – chỉ render khi >1 ảnh */}
      {hasMultiple && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1.5, overflowX: "auto", pb: 0.5 }}
        >
          {safeImages.map((img, idx) => {
            const src =
              img === NO_IMAGE_PLACEHOLDER ? img : getThumb(img);
            const isActive = idx === active;

            return (
              <Box
                key={idx}
                onClick={() => setActive(idx)}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: isActive ? "primary.main" : "divider",
                  cursor: "pointer",
                  flex: "0 0 auto",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`thumb-${idx}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
