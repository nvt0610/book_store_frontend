// src/pages/client/author/AuthorDetailPage.tsx
import { Box, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";

import { useLookupEntity } from "@/hooks/useLookupEntity";
import AuthorHeader from "./components/AuthorHeader";
import AuthorProductList from "./components/AuthorProductList";

export default function AuthorDetailPage() {
  const { id } = useParams();

  const { data: author, loading } = useLookupEntity("author", id);

  if (loading) {
    return <Skeleton height={300} />;
  }

  if (!author) {
    return <Box>Không tìm thấy tác giả</Box>;
  }

  return (
    <Box>
      <AuthorHeader author={author} />
      <AuthorProductList authorId={author.id} authorName={author.name} />
    </Box>
  );
}
