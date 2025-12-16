import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

export default function AddressSelectPanel({
  userId,
  value,
  options,
  loading,
  onChange,
}: {
  userId: string;
  value: string;
  options: any[];
  loading: boolean;
  onChange: (id: string) => void;
}) {
  const safeOptions = Array.isArray(options) ? options : [];

  if (loading) {
    return <Typography>Đang tải địa chỉ...</Typography>;
  }

  if (!safeOptions.length) {
    return <Typography>Chưa có địa chỉ</Typography>;
  }

  return (
    <Box
      sx={{
        maxHeight: 280,          // 👈 GIỚI HẠN CHIỀU CAO
        overflowY: "auto",       // 👈 SCROLL
        border: "1px solid #eee",
        borderRadius: 1,
      }}
    >
      <RadioGroup
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {safeOptions.map((a) => (
          <Box
            key={a.id}
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #eee",
              bgcolor: value === a.id ? "#f5f8ff" : "transparent",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "#f9fafb",
              },
            }}
          >
            <FormControlLabel
              value={a.id}
              control={<Radio />}
              sx={{ alignItems: "flex-start", m: 0 }}
              label={
                <Box>
                  <Typography fontWeight={600}>
                    {a.full_name}
                  </Typography>

                  <Typography fontSize={13}>
                    {a.address_line} – {a.phone}
                  </Typography>

                  {a.is_default && (
                    <Typography fontSize={12} color="success.main">
                      Mặc định
                    </Typography>
                  )}
                </Box>
              }
            />
          </Box>
        ))}
      </RadioGroup>
    </Box>
  );
}
