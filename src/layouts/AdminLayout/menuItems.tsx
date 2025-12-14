import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import BusinessIcon from "@mui/icons-material/Business";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const adminMenuGroups = [
  {
    label: "Hệ thống",
    items: [
      { label: "Bảng điều khiển", icon: <DashboardIcon />, path: "/admin" },
    ],
  },

  {
    label: "Người dùng & Danh mục",
    items: [
      { label: "Người dùng", icon: <PersonIcon />, path: "/admin/users" },
      { label: "Danh mục", icon: <CategoryIcon />, path: "/admin/categories" },
      { label: "Tác giả", icon: <PersonIcon />, path: "/admin/authors" },
      {
        label: "Nhà xuất bản",
        icon: <BusinessIcon />,
        path: "/admin/publishers",
      },
    ],
  },

  {
    label: "Sản phẩm",
    items: [
      { label: "Sản phẩm", icon: <BookIcon />, path: "/admin/products" },
    ],
  },

  {
    label: "Đơn hàng & Thanh toán",
    items: [
      { label: "Đơn hàng", icon: <ReceiptIcon />, path: "/admin/orders" },
      { label: "Thanh toán", icon: <ShoppingCartIcon />, path: "/admin/payments" },
      { label: "Địa chỉ", icon: <HomeIcon />, path: "/admin/addresses" },
      { label: "Giỏ hàng", icon: <ShoppingBagIcon />, path: "/admin/carts" },
    ],
  },
];

export const systemMenu = [
  { label: "Về trang chủ", icon: <ArrowBackIcon />, path: "/" },
  { label: "Đăng xuất", icon: <LogoutIcon />, action: "logout" },
];
