import { createBrowserRouter } from "react-router-dom";
import AppBootstrap from "@/components/common/AppBootstrap";

import MainLayout from "@/layouts/MainLayout/MainLayout";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import TestPage from "@/pages/TestPage";

// ===== CLIENT PAGES =====
import ProductDetailPage from "@/pages/client/product/ProductDetailPage";
import SearchPage from "@/pages/client/search/SearchPage";
import AuthorDetailPage from "@/pages/client/author/AuthorDetailPage";
import PublisherDetailPage from "@/pages/client/publisher/PublisherDetailPage";
import CartPage from "@/pages/client/cart/CartPage";
import CheckoutPage from "@/pages/client/checkout/CheckoutPage";
import AccountPage from "@/pages/client/account/AccountPage";

// ===== ADMIN PAGES =====
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UserListPage from "@/pages/admin/users/UserListPage";
import UserFormPage from "@/pages/admin/users/UserFormPage";
import CategoryListPage from "@/pages/admin/categories/CategoryListPage";
import CategoryFormPage from "@/pages/admin/categories/CategoryFormPage";
import ProductListPage from "@/pages/admin/products/ProductListPage";
import ProductFormPage from "@/pages/admin/products/ProductFormPage";
import PublisherFormPage from "@/pages/admin/publishers/PublisherFormPage";
import PublisherListPage from "@/pages/admin/publishers/PublisherListPage";
import AuthorFormPage from "@/pages/admin/authors/AuthorFormPage";
import AuthorListPage from "@/pages/admin/authors/AuthorListPage";
import OrderFormPage from "@/pages/admin/orders/OrderFormPage";
import OrderListPage from "@/pages/admin/orders/OrderListPage";
import AddressFormPage from "@/pages/admin/addresses/AddressFormPage";
import AddressListPage from "@/pages/admin/addresses/AddressListPage";
import PaymentFormPage from "@/pages/admin/payments/PaymentFormPage";
import PaymentListPage from "@/pages/admin/payments/PaymentListPage";
import CartFormPage from "@/pages/admin/carts/CartFormPage";
import CartListPage from "@/pages/admin/carts/CartListPage";

export const router = createBrowserRouter([
  {
    element: <AppBootstrap />, // 👈 THÊM DUY NHẤT DÒNG NÀY
    children: [
      /* ============================
            CLIENT LAYOUT
         ============================ */
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "test", element: <TestPage /> },
          { path: "product/:id", element: <ProductDetailPage /> },
          { path: "author/:id", element: <AuthorDetailPage /> },
          { path: "publisher/:id", element: <PublisherDetailPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "account", element: <AccountPage /> },
          { path: "account", element: <AccountPage /> },
          { path: "*", element: <div>404 Not Found</div> },
        ],
      },

      /* ============================
            AUTH (NO LAYOUT)
         ============================ */
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      /* ============================
              ADMIN LAYOUT
         ============================ */
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },

          { path: "users", element: <UserListPage /> },
          { path: "users/new", element: <UserFormPage /> },
          { path: "users/:id", element: <UserFormPage /> },

          { path: "categories", element: <CategoryListPage /> },
          { path: "categories/new", element: <CategoryFormPage /> },
          { path: "categories/:id", element: <CategoryFormPage /> },

          { path: "products", element: <ProductListPage /> },
          { path: "products/new", element: <ProductFormPage /> },
          { path: "products/:id", element: <ProductFormPage /> },

          { path: "authors", element: <AuthorListPage /> },
          { path: "authors/new", element: <AuthorFormPage /> },
          { path: "authors/:id", element: <AuthorFormPage /> },

          { path: "publishers", element: <PublisherListPage /> },
          { path: "publishers/new", element: <PublisherFormPage /> },
          { path: "publishers/:id", element: <PublisherFormPage /> },

          { path: "orders", element: <OrderListPage /> },
          { path: "orders/new", element: <OrderFormPage /> },
          { path: "orders/:id", element: <OrderFormPage /> },

          { path: "addresses", element: <AddressListPage /> },
          { path: "addresses/new", element: <AddressFormPage /> },
          { path: "addresses/:id", element: <AddressFormPage /> },

          { path: "payments", element: <PaymentListPage /> },
          { path: "payments/new", element: <PaymentFormPage /> },
          { path: "payments/:id", element: <PaymentFormPage /> },

          { path: "carts", element: <CartListPage /> },
          { path: "carts/new", element: <CartFormPage /> },
          { path: "carts/:id", element: <CartFormPage /> },
        ],
      },
    ],
  },
]);
