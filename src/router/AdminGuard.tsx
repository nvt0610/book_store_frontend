import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function AdminGuard() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    // Chưa login -> Login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "ADMIN") {
    // Đã login nhưng không phải ADMIN -> Về trang chủ
    return <Navigate to="/" replace />;
  }

  // OK -> Render content
  return <Outlet />;
}
