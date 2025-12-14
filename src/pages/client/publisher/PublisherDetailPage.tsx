// src/pages/client/publisher/PublisherDetailPage.tsx
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { useLookupEntity } from "@/hooks/useLookupEntity";
import PublisherHeader from "./components/PublisherHeader";
import PublisherProductList from "./components/PublisherProductList";

export default function PublisherDetailPage() {
  const { id } = useParams();
  const { data: publisher, loading } = useLookupEntity("publisher", id);

  if (loading || !publisher) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <PublisherHeader publisher={publisher} />

      <PublisherProductList
        publisherId={publisher.id}
        publisherName={publisher.name}
      />
    </Box>
  );
}
