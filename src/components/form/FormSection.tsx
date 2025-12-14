import { Typography, Box } from "@mui/material";

export default function FormSection({
  title,
  children,
  sx = {},
}: {
  title: string;
  children: any;
  sx?: any;
}) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
