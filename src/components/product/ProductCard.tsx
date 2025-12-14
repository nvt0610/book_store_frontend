import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMedium } from "@/utils/image";
import { useState } from "react";
import { NO_IMAGE_PLACEHOLDER } from "@/utils/imagePlaceholder";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const imgSrc =
    !error && product.main_image
      ? getMedium(product.main_image)
      : NO_IMAGE_PLACEHOLDER;

  return (
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        cursor: "pointer",
        position: "relative",
        transition: "all .25s ease",
        boxShadow: 1,

        // 👇 mờ khi hết hàng
        opacity: product.stock === 0 ? 0.65 : 1,

        "&:hover": {
          boxShadow: product.stock === 0 ? 1 : 6,
          transform: product.stock === 0 ? "none" : "translateY(-4px)",
        },

        "&:hover .product-img": {
          transform: product.stock === 0 ? "none" : "scale(1.05)",
        },

        "&:hover .hover-overlay": {
          opacity: 1,
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 220,
          overflow: "hidden",
          bgcolor: "#f5f5f5",
        }}
      >
        {product.stock === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "error.main",
              color: "#fff",
              px: 1.2,
              py: 0.4,
              borderRadius: 1,
              fontSize: 12,
              fontWeight: 700,
              zIndex: 2,
            }}
          >
            Hết hàng
          </Box>
        )}
        <CardMedia
          component="img"
          src={imgSrc}
          onError={() => setError(true)}
          className="product-img"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .35s ease",
          }}
        />

        {/* Hover overlay */}
        <Box
          className="hover-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.35)",
            opacity: 0,
            transition: "opacity .25s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            Xem chi tiết
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Tooltip title={product.name}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: 48,
            }}
          >
            {product.name}
          </Typography>
        </Tooltip>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontStyle: "italic",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: 20,
            mb: 1,
          }}
        >
          {product.author_name}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mt: "auto",
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {Number(product.price).toLocaleString("vi-VN")} ₫
        </Typography>
      </CardContent>
    </Card>
  );
}
