import { useEffect } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { authorApi } from "@/api/authors";
import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";

import { useFormState } from "@/hooks/useFormState";
import { useImageUpload } from "@/hooks/useImageUpload";

import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";
import ImageUploader from "@/components/form/ImageUploader";

export default function AuthorForm({
  initialData,
}: {
  initialData: any | null;
}) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  const { form, setForm, handleChange } = useFormState(initialData, {
    name: "",
    biography: "",
    photo_url: "",
  });

  const { preview, setPreview, uploadSingle } = useImageUpload();

  useEffect(() => {
    if (initialData?.photo_url) {
      setPreview(initialData.photo_url);
    }
  }, [initialData]);

  const onUpload = async (file: File) => {
    const uploaded = await uploadSingle(file);
    if (uploaded?.url) {
      setForm((p) => ({ ...p, photo_url: uploaded.url }));
      setPreview(uploaded.thumbnail || uploaded.url);
    }
  };

  const handleSubmit = async () => {
    try {
      validate.required(form.name, "Tên tác giả");

      const payload = {
        name: form.name.trim(),
        biography: form.biography.trim() || undefined,
        photo_url: form.photo_url || null,
      };

      if (isEdit && initialData) {
        await authorApi.update(initialData.id, payload);
        alertSuccess("Cập nhật tác giả thành công");
      } else {
        await authorApi.create(payload);
        alertSuccess("Tạo tác giả mới thành công");
      }

      navigate("/admin/authors");
    } catch (err: any) {
      alertError(err?.response?.data?.message || err.message);
    }
  };

  // UI
  return (
    <Box>
      <Grid container spacing={4}>
        {/* LEFT: Thông tin tác giả */}
        <Grid item xs={12} md={8}>
          <FormSection title="Thông tin tác giả">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Tên tác giả"
                  name="name"
                  fullWidth
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Tiểu sử"
                  name="biography"
                  fullWidth
                  multiline
                  value={form.biography}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 200,
                      alignItems: "flex-start",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    },
                    "& textarea": {
                      height: "100% !important",
                      overflowY: "auto",
                      resize: "none",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </FormSection>
        </Grid>

        {/* RIGHT: Ảnh tác giả */}
        <Grid item xs={12} md={4} sx={{ pr: 0, pl: 0 }}>
          <FormSection 
            title="Ảnh tác giả" 
            sx={{ 
              p: 0,
              '& > *:first-of-type': { // Target title wrapper nếu có
                px: 2,
              }
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ImageUploader preview={preview} onUpload={onUpload} />
            </Box>
          </FormSection>
        </Grid>
      </Grid>

      {/* Submit */}
      <FormSubmitBar
        backUrl="/admin/authors"
        loading={false}
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
