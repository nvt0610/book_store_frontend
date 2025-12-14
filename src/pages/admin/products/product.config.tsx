// src/pages/admin/products/product.config.tsx
import { Box, Select, MenuItem, Avatar } from "@mui/material";
import uploadApi from "@/api/upload";
import categoryApi from "@/api/categories";
import authorApi from "@/api/authors";
import publisherApi from "@/api/publishers";
import ProductForm from "./components/ProductForm";

export const productConfig = {
  title: "Products",
  subtitle: "Quản lý sản phẩm / sách trong hệ thống",
  searchPlaceholder: "Tìm theo tên sản phẩm...",
  formComponent: ProductForm,

  pageSize: 10,
  defaultSortBy: "created_at",
  defaultSortDir: "DESC",

  /** ===================== CREATE ===================== */
  onCreate: () => {
    window.location.href = "/admin/products/new";
  },
  createText: "Tạo sản phẩm mới",

  /** ===================== TABLE COLUMNS ===================== */
  columns: [
    {
      field: "main_image",
      label: "Ảnh",
      align: "center",
      sx: { width: 80 },
      renderCell: (value) => (
        <Avatar
          src={value || "/no-image.png"}
          variant="rounded"
          sx={{ width: 48, height: 48 }}
        />
      ),
    },

    {
      field: "name",
      label: "Tên sản phẩm",
      sx: { fontWeight: 600, minWidth: 160 },
    },

    {
      field: "price",
      label: "Giá",
      sx: { minWidth: 80 },
      renderCell: (v) => `${Number(v).toLocaleString()} đ`,
    },

    {
      field: "stock",
      label: "Tồn kho",
      align: "center",
      sx: { minWidth: 60 },
      renderCell: (v) => (
        <Box
          sx={{
            px: 1,
            py: 0.3,
            bgcolor: v > 0 ? "#e8f5e9" : "#ffebee",
            color: v > 0 ? "#2e7d32" : "#c62828",
            borderRadius: "12px",
            fontWeight: 600,
            display: "inline-block",
            minWidth: 32,
            textAlign: "center",
          }}
        >
          {v}
        </Box>
      ),
    },

    { field: "status", label: "Trạng thái", type: "chip" },
    { field: "created_at", label: "Ngày tạo", type: "datetime" },
  ],

  /** ===================== EDIT / DELETE ===================== */
  onEdit: (id) => {
    window.location.href = `/admin/products/${id}`;
  },

  onDelete: async (id) => {
    if (!confirm("Xác nhận xoá sản phẩm?")) return;
    const { productApi } = await import("@/api/products");
    await productApi.remove(id);
    window.location.reload();
  },

  /** ===================== FILTER ===================== */
  renderFilters: null,

  /** ===================== SORT ===================== */
  renderSort(sortBy, sortDir, setSortBy, setSortDir) {
    return (
      <Select
        size="small"
        value={sortDir}
        onChange={(e) => setSortDir(e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="DESC">Mới nhất</MenuItem>
        <MenuItem value="ASC">Cũ nhất</MenuItem>
      </Select>
    );
  },

  /** ===================== FORM DEFAULT ===================== */
  defaultForm: {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: "",
    publisher_id: "",
    author_id: "",
    main_image: "",
    extra_images: [],
  },

  /** ===================== FORM FIELDS ===================== */
  formFields: [
    { name: "name", label: "Tên sản phẩm" },
    { name: "description", label: "Mô tả" },
    { name: "price", label: "Giá", type: "number" },
    { name: "stock", label: "Tồn kho", type: "number" },
  ],

  /** Optional field rendering — FE can inject dropdowns here */
  async loadSelectOptions() {
    const [cats, pubs, authors] = await Promise.all([
      categoryApi.list(),
      publisherApi.list(),
      authorApi.list(),
    ]);

    return {
      categories: cats.data,
      publishers: pubs.data,
      authors: authors.data,
    };
  },

  titleCreate: "Tạo sản phẩm mới",
  titleEdit: "Chỉnh sửa sản phẩm",

  onSaved: () => {
    window.location.href = "/admin/products";
  },

  async onRestore(id) {
    const { restoreApi } = await import("@/api/restoreApi");
    return restoreApi.restore("products", id);
  },
};
