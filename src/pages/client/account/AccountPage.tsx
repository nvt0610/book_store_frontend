import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet, useMatch } from "react-router-dom";

import AccountTabs from "./components/AccountTabs";
import ProfileInfoForm from "./components/ProfileInfoForm";
import AddressList from "./components/AddressList";
import DeactivateAccountBox from "./components/DeactivateAccountBox";

import type { AccountTabKey } from "./account.types";

export default function AccountPage() {
  const [tab, setTab] = useState<AccountTabKey>("profile");

  // ✅ kiểm tra đang ở route con (order detail)
  const isOrderDetail = useMatch("/account/orders/:id");

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {/* Tabs chỉ hiển thị khi KHÔNG ở order detail */}
      {!isOrderDetail && (
        <AccountTabs value={tab} onChange={setTab} />
      )}

      <Box sx={{ mt: 3 }}>
        {/* Nếu là route con → render OrderDetailPage */}
        {isOrderDetail ? (
          <Outlet />
        ) : (
          <>
            {tab === "profile" && <ProfileInfoForm />}
            {tab === "address" && <AddressList />}
            {tab === "security" && <DeactivateAccountBox />}
          </>
        )}
      </Box>
    </Box>
  );
}
