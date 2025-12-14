import { useEffect, useState, useMemo } from "react";
import { Box, Grid, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { categoryApi } from "@/api/categories";
import { productApi } from "@/api/products";
import { alertError, alertSuccess } from "@/utils/alert";
import { validate } from "@/utils/validation";
import { unwrapList, unwrapItem } from "@/utils/unwrap";

import { useFormState } from "@/hooks/useFormState";
import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";
import ProductSelectGrid from "@/components/form/ProductSelectGrid";

export default function CategoryForm({
  initialData,
}: {
  initialData: any | null;
}) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  const { form, setForm, handleChange } = useFormState(initialData, {
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(
    new Map()
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        let allProducts = [];

        if (!isEdit) {
          const res = await productApi.list({
            page: 1,
            pageSize: 500,
            category_id: null,
          });
          allProducts = unwrapList(res);
          setSelectedProducts([]);
        } else {
          const resAll = await productApi.list({ page: 1, pageSize: 500 });
          allProducts = unwrapList(resAll);

          const resMine = await productApi.list({
            page: 1,
            pageSize: 500,
            category_id: initialData!.id,
          });

          const mine = unwrapList(resMine);
          setSelectedProducts(mine.map((p: any) => p.id));
        }

        setProductList(allProducts);

        const resCategories = await categoryApi.list({
          page: 1,
          pageSize: 500,
        });
        const categories = unwrapList(resCategories);

        const map = new Map<string, string>();
        categories.forEach((c: any) => map.set(c.id, c.name));
        setCategoryMap(map);
      } catch {}
    };

    load();
  }, [isEdit, initialData]);

  const filteredList = useMemo(() => {
    return productList.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, productList]);

  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      const aSel = selectedProducts.includes(a.id);
      const bSel = selectedProducts.includes(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return 0;
    });
  }, [filteredList, selectedProducts]);

  const toggleProduct = (p: any) => {
    setSelectedProducts((prev) =>
      prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
    );
  };

  const handleSubmit = async () => {
    try {
      validate.required(form.name, "Tên danh mục");
      validate.max(form.name, 60);
    } catch (err: any) {
      alertError(err?.message);
      return;
    }

    try {
      setLoading(true);
      let categoryId = initialData?.id ?? null;

      if (!isEdit) {
        const created = unwrapItem(
          await categoryApi.create({
            name: form.name.trim(),
            description: form.description.trim() || undefined,
          })
        );
        categoryId = created.id;
      } else {
        await categoryApi.update(categoryId!, {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        });
      }

      const resOld = await productApi.list({
        page: 1,
        pageSize: 500,
        category_id: categoryId!,
      });

      const old = new Set(unwrapList(resOld).map((p: any) => p.id));
      const current = new Set(selectedProducts);

      const addList = [...current].filter((x) => !old.has(x));
      const removeList = [...old].filter((x) => !current.has(x));

      if (addList.length) await categoryApi.addProducts(categoryId!, addList);
      if (removeList.length)
        await categoryApi.removeProducts(categoryId!, removeList);

      alertSuccess(isEdit ? "Cập nhật thành công" : "Tạo mới thành công");
      navigate("/admin/categories");
    } catch (err: any) {
      alertError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <FormSection title="Thông tin danh mục">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Tên danh mục"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              label="Mô tả"
              name="description"
              fullWidth
              multiline
              value={form.description}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  height: 180, // ✨ CHO NÓ BỰ SẴN
                  alignItems: "flex-start",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                },
                "& textarea": {
                  height: "100% !important", // Chiều cao cố định
                  overflowY: "auto", // Scroll khi nhiều nội dung
                  resize: "none", // Không cho người dùng kéo
                },
              }}
            />
          </Grid>
        </Grid>
      </FormSection>

      <FormSection title="Chọn sản phẩm">
        <TextField
          size="small"
          placeholder="Tìm sản phẩm…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, minWidth: 280 }}
        />

        <Typography fontWeight={600} mb={1}>
          Đã chọn: {selectedProducts.length}
        </Typography>

        <ProductSelectGrid
          items={sortedList}
          selected={selectedProducts}
          onToggle={toggleProduct}
          showPrice={false}
        />
      </FormSection>

      <FormSubmitBar
        backUrl="/admin/categories"
        loading={loading}
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
