import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title?: string;
  action?: ReactNode; // nút "Xem thêm" sau này
  children: ReactNode;
  mb?: number;
}

export default function Section({
  title,
  action,
  children,
  mb = 5,
}: Props) {
  return (
    <Box sx={{ mb }}>
      {(title || action) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          {title && (
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          )}
          {action}
        </Box>
      )}

      {children}
    </Box>
  );
}
