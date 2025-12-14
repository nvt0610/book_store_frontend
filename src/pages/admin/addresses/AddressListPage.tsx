// src/pages/admin/addresses/AddressListPage.tsx
import { useEffect, useState } from "react";
import CrudListPage from "@/components/crud/CrudListPage";
import { addressConfig } from "./address.config";
import { addressApi } from "@/api/addresses";
import { userApi } from "@/api/users";
import AddressTable from "./components/AddressTable";
import { unwrapList } from "@/utils/unwrap";

export default function AddressListPage() {
  const [userMap, setUserMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const res = await userApi.list({ page: 1, pageSize: 500 });

      // ⭐ LẤY ARRAY ĐÚNG CHUẨN
      const users = unwrapList(res);

      const map = {};
      users.forEach((u) => {
        map[u.id] = { email: u.email };
      });

      setUserMap(map);
      setLoaded(true);
    }

    loadUsers();
  }, []);

  if (!loaded) return <div>Đang tải dữ liệu...</div>;

  return (
    <CrudListPage
      config={addressConfig}
      api={{
        ...addressApi,

        // ⭐ OVERRIDE LIST: unwrap + merge email
        async list(params) {
          const res = await addressApi.list(params);

          // ⭐ BẮT BUỘC unwrap (QUAN TRỌNG)
          const rows = unwrapList(res);

          const merged = rows.map((addr) => ({
            ...addr,
            user_email: userMap[addr.user_id]?.email || "-",
          }));

          return {
            ...res,
            data: {
              ...res.data,
              data: merged,
            },
          };
        },
      }}
      TableComponent={AddressTable}
    />
  );
}
