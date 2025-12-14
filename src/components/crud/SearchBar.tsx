// src/components/crud/SearchBar.tsx
import { Box, TextField, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Close";

export default function SearchBar({ value, onChange, onSearch, placeholder }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ position: "relative" }}>
        <TextField
          size="small"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          sx={{ minWidth: 260 }}
        />

        {value && (
          <IconButton
            size="small"
            onClick={() => onChange("")}
            sx={{
              position: "absolute",
              right: 4,
              top: "50%",
              transform: "translateY(-50%)",
              padding: 0.2,
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Button variant="outlined" size="small" onClick={onSearch}>
        TÌM KIẾM
      </Button>
    </Box>
  );
}
