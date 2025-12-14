import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { categoryApi } from "@/api/categories";
import { authorApi } from "@/api/authors";
import { publisherApi } from "@/api/publishers";
import { useLookupStore } from "@/store/lookupStore";
import { unwrapList } from "@/utils/unwrap";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function AppBootstrap() {
  const {
    loading,
    isExpired,
    setCategories,
    setAuthors,
    setPublishers,
    markLoaded,
  } = useLookupStore();

  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const loadCart = useCartStore((s) => s.loadCart);

  useEffect(() => {
    if (loading) return;
    if (!isExpired()) return;

    let mounted = true;
    useLookupStore.setState({ loading: true });

    (async () => {
      try {
        const [catRes, authorRes, pubRes] = await Promise.all([
          categoryApi.list({ pageSize: 100 }),
          authorApi.list({ pageSize: 100 }),
          publisherApi.list({ pageSize: 100 }),
        ]);

        if (!mounted) return;

        setCategories(unwrapList(catRes));
        setAuthors(unwrapList(authorRes));
        setPublishers(unwrapList(pubRes));
        markLoaded();
      } catch (err) {
        console.error("[AppBootstrap] preload lookup failed", err);
        useLookupStore.setState({ loading: false });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // ✅ chỉ load cart khi auth đã rõ ràng
    if (user && accessToken) {
      loadCart();
    }
  }, [user, accessToken]);

  return <Outlet />;
}
