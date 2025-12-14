import { useEffect, useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";
import { unwrapList } from "@/utils/unwrap";

import { useFormState } from "@/hooks/useFormState";
import { useImageUpload } from "@/hooks/useImageUpload";

import AsyncSelect from "@/components/form/AsyncSelect";
import ImageUploader from "@/components/form/ImageUploader";
import MultiImageUploader from "@/components/form/MultiImageUploader";
import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";

import { productApi } from "@/api/products";
import { categoryApi } from "@/api/categories";
import { authorApi } from "@/api/authors";
import { uploadApi } from "@/api/upload";
import { publisherApi } from "@/api/publishers";

import { NumericFormat } from "react-number-format";

export default function ProductForm({ initialData }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  const { form, setForm } = useFormState(initialData, {
    name: "",
    description: "",
    price: "",
    stock: 0,
    main_image: "",
    extra_images: [],
    category_id: "",
    author_id: "",
    publisher_id: "",
    status: "ACTIVE",
  });

  const { preview, setPreview, uploadSingle, uploadMultiple } =
    useImageUpload();
  const [previewExtra, setPreviewExtra] = useState<string[]>(
    initialData?.extra_images || []
  );

  useEffect(() => {
    if (initialData?.main_image) {
      setPreview(initialData.main_image);
    }
    if (initialData?.extra_images) {
      setPreviewExtra(initialData.extra_images);
    }
  }, [initialData]);

  const handleUploadMain = async (file: File) => {
    const res = await uploadSingle(file);
    if (res) {
      setForm((p) => ({ ...p, main_image: res.url }));
    }
  };

  const handleUploadExtra = async (files: File[]) => {
    try {
      const { urls } = await uploadApi.multiple(files);

      const combined = [...form.extra_images, ...urls];

      setForm((p) => ({ ...p, extra_images: combined }));
      setPreviewExtra(combined);
    } catch {
      alertError("Upload ảnh thất bại");
    }
  };

  const removeExtra = (url: string) => {
    const filtered = form.extra_images.filter((x) => x !== url);
    setForm((p) => ({ ...p, extra_images: filtered }));
    setPreviewExtra(filtered);
  };

  const handleSubmit = async () => {
    try {
      validate.required(form.name, "Tên sản phẩm");
      validate.required(form.price, "Giá");
      validate.required(form.author_id, "Tác giả");
      validate.required(form.publisher_id, "Nhà xuất bản");

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (!payload.category_id) delete payload.category_id;

      if (isEdit) {
        await productApi.update(initialData.id, payload);
        alertSuccess("Cập nhật sản phẩm thành công");
      } else {
        await productApi.create(payload);
        alertSuccess("Tạo sản phẩm mới thành công");
      }

      navigate("/admin/products");
    } catch (err: any) {
      alertError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <Grid container spacing={4}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={7}>
          {/* ===== THÔNG TIN SẢN PHẨM ===== */}
          <FormSection title="Thông tin sản phẩm">
            <Grid container spacing={2}>
              {/* NAME */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </Grid>

              {/* PRICE */}
              <Grid item xs={12} md={6}>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  label="Giá"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={form.price}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, price: v.value }))
                  }
                />
              </Grid>

              {/* DESCRIPTION */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={6}
                  label="Mô tả"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </Grid>

              {/* STOCK */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tồn kho"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stock: Number(e.target.value) }))
                  }
                />
              </Grid>
            </Grid>
          </FormSection>

          {/* ===== PHÂN LOẠI ===== */}
          <FormSection title="Phân loại">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <AsyncSelect
                  fullWidth
                  label="Danh mục"
                  value={form.category_id}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, category_id: v?.id ?? "" }))
                  }
                  fetchOptions={async (q) => {
                    const res = await categoryApi.list({ q, pageSize: 20 });
                    return unwrapList(res);
                  }}
                  getOptionLabel={(o) => o.name}
                />
              </Box>

              <Box>
                <AsyncSelect
                  fullWidth
                  label="Tác giả"
                  value={form.author_id}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, author_id: v?.id ?? "" }))
                  }
                  fetchOptions={async (q) => {
                    const res = await authorApi.list({ q, pageSize: 20 });
                    return unwrapList(res);
                  }}
                  getOptionLabel={(o) => o.name}
                />
              </Box>

              <Box>
                <AsyncSelect
                  fullWidth
                  label="Nhà xuất bản"
                  value={form.publisher_id}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, publisher_id: v?.id ?? "" }))
                  }
                  fetchOptions={async (q) => {
                    const res = await publisherApi.list({ q, pageSize: 20 });
                    return unwrapList(res);
                  }}
                  getOptionLabel={(o) => o.name}
                />
              </Box>
            </Box>
          </FormSection>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={5}>
          <FormSection title="Ảnh sản phẩm">
            <ImageUploader
              label="Ảnh chính"
              preview={preview || form.main_image}
              onUpload={handleUploadMain}
            />

            <MultiImageUploader
              images={previewExtra}
              onUpload={handleUploadExtra}
              onRemove={removeExtra}
            />
          </FormSection>
        </Grid>
      </Grid>

      <FormSubmitBar
        backUrl="/admin/products"
        loading={false}
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
