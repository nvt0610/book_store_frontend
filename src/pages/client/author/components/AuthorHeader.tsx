// src/pages/client/author/components/AuthorHeader.tsx
import { Box, Avatar, Typography } from "@mui/material";

export default function AuthorHeader({ author }) {
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
        src={author.photo_url || undefined}
        sx={{
          width: 96,
          height: 96,
          bgcolor: "primary.main",
          fontSize: 36,
        }}
      >
        {author.name?.[0]}
      </Avatar>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {author.name}
        </Typography>

        {author.biography && (
          <Typography color="text.secondary">
            {author.biography}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
