// src/pages/admin/publishers/components/PublisherForm.tsx
import { useEffect } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";

import { useFormState } from "@/hooks/useFormState";
import { useImageUpload } from "@/hooks/useImageUpload";

import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";
import ImageUploader from "@/components/form/ImageUploader";
import { usePhoneField } from "@/hooks/usePhoneField";

import { publisherApi } from "@/api/publishers";

export default function PublisherForm({ initialData }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  // -----------------------------
  // FORM STATE
  // -----------------------------
  const { form, setForm } = useFormState(initialData, {
    name: "",
    address: "",
    phone: "",
    website: "",
    logo_url: "",
  });
  const phone = usePhoneField(11);
  // -----------------------------
  // IMAGE UPLOAD
  // -----------------------------
  const { preview, setPreview, uploadSingle } = useImageUpload();

  useEffect(() => {
    if (initialData?.logo_url) {
      setPreview(initialData.logo_url);
    }
  }, [initialData]);

  const handleUploadLogo = async (file: File) => {
    const res = await uploadSingle(file);
    if (!res) return;

    setForm((p) => ({ ...p, logo_url: res.url }));
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async () => {
    try {
      validate.required(form.name, "Tên nhà xuất bản");

      const payload = {
        name: form.name.trim(),
        address: form.address.trim() || null,
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        logo_url: form.logo_url || null,
      };

      if (isEdit) {
        await publisherApi.update(initialData.id, payload);
        alertSuccess("Cập nhật nhà xuất bản thành công");
      } else {
        await publisherApi.create(payload);
        alertSuccess("Tạo nhà xuất bản thành công");
      }

      navigate("/admin/publishers");
    } catch (err) {
      alertError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <Grid container spacing={4}>
        {/* LEFT */}
        <Grid item xs={12} md={8}>
          <FormSection title="Thông tin nhà xuất bản">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên nhà xuất bản"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={phone.value}
                  error={!!phone.error}
                  helperText={phone.error || " "}
                  onChange={(e) => {
                    phone.onChange(e.target.value);
                    setForm((p) => ({ ...p, phone: e.target.value }));
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  value={form.website}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, website: e.target.value }))
                  }
                />
              </Grid>
            </Grid>
          </FormSection>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <FormSection title="Logo nhà xuất bản">
            <ImageUploader
              label="Logo"
              preview={preview || form.logo_url}
              onUpload={handleUploadLogo}
            />
          </FormSection>
        </Grid>
      </Grid>

      <FormSubmitBar
        backUrl="/admin/publishers"
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
