// frontend/src/pages/client/account/components/AddressCard.tsx
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  const {
    id,
    full_name,
    phone,
    address_line,
    address_line2,
    is_default,
  } = address;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderLeft: is_default ? "4px solid" : "none",
        borderColor: "primary.main",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {full_name}
          </Typography>
          {is_default && (
            <Chip
              label="Mặc định"
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {address_line}
        </Typography>
        {address_line2 && (
          <Typography variant="body2" color="text.secondary">
            {address_line2}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Điện thoại:</strong> {phone}
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
        }}
      >
        {!is_default && (
          <Button
            size="small"
            onClick={() => onSetDefault(id)}
            startIcon={<StarIcon />}
          >
            Đặt mặc định
          </Button>
        )}
        <Button
          size="small"
          onClick={() => onEdit(address)}
          startIcon={<EditIcon />}
          color="inherit"
        >
          Sửa
        </Button>
        <Button
          size="small"
          onClick={() => onDelete(id)}
          startIcon={<DeleteIcon />}
          color="error"
        >
          Xóa
        </Button>
      </Box>
    </Paper>
  );
}
