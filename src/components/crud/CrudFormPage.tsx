// src/components/crud/CrudFormPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { alertError } from "@/utils/alert";
import { unwrapItem } from "@/utils/unwrap";

interface CrudFormConfig<T> {
  titleCreate: string;
  titleEdit: string;
  subtitleCreate?: string;
  subtitleEdit?: string;
  formComponent: React.ComponentType<{ initialData: T | null }>;
}

interface CrudFormPageProps<T> {
  config: CrudFormConfig<T>;
  api: { getById: (id: string) => Promise<T> };
}

export default function CrudFormPage<T>({ config, api }: CrudFormPageProps<T>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    titleCreate,
    titleEdit,
    subtitleCreate = "",
    subtitleEdit = "",
    formComponent: FormComponent,
  } = config;

  const isEdit = Boolean(id);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.getById(id);
        if (mounted) {
          // Smart unwrap: if res.data.data exists -> use it; else if res.data exists -> use it; else use res
          // (Handle inconsistency between different APIs)
          const item = (res as any)?.data?.data 
            ? (res as any).data.data 
            : (res as any)?.data 
              ? (res as any).data 
              : res;
              
          setData(item);
          window.scrollTo({ top: 0 });
        }
      } catch (err: any) {
        alertError(err?.response?.data?.message || "Không tải được dữ liệu");
        navigate(-1);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <Box sx={{ pb: 3 }}>
      {/* HEADER */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? titleEdit : titleCreate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? subtitleEdit : subtitleCreate}
        </Typography>
      </Box>

      {/* FORM */}
      <Card>
        <CardContent sx={{ px: 3, py: 3 }}>
          {loading && isEdit ? (
            <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <FormComponent initialData={data} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
