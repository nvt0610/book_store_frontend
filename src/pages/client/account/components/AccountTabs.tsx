// components/AccountTabs.tsx
import { Tabs, Tab } from "@mui/material";
import type { AccountTabKey } from "../account.types";

export default function AccountTabs({
  value,
  onChange,
}: {
  value: AccountTabKey;
  onChange: (v: AccountTabKey) => void;
}) {
  return (
    <Tabs value={value} onChange={(_, v) => onChange(v)}>
      <Tab value="profile" label="Thông tin cá nhân" />
      <Tab value="address" label="Địa chỉ" />
      <Tab value="security" label="Bảo mật" />
      <Tab value="orders" label="Đơn hàng của tôi" />
    </Tabs>
  );
}
