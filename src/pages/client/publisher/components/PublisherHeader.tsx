// src/pages/client/publisher/components/PublisherHeader.tsx
import { Box, Avatar, Typography, Link } from "@mui/material";

export default function PublisherHeader({ publisher }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "center",
        mb: 4,
      }}
    >
      <Avatar
        src={publisher.logo_url || undefined}
        sx={{
          width: 96,
          height: 96,
          bgcolor: "primary.main",
        }}
        variant="rounded"
      >
        {publisher.name?.[0]}
      </Avatar>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {publisher.name}
        </Typography>

        {publisher.address && (
          <Typography color="text.secondary">
            {publisher.address}
          </Typography>
        )}

        {publisher.website && (
          <Link
            href={publisher.website}
            target="_blank"
            rel="noopener"
            underline="hover"
          >
            {publisher.website}
          </Link>
        )}
      </Box>
    </Box>
  );
}
