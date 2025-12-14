// AccountPage.tsx
import { Box } from "@mui/material";
import { useState } from "react";
import AccountTabs from "./components/AccountTabs";
import ProfileInfoForm from "./components/ProfileInfoForm";
import AddressList from "./components/AddressList";
import DeactivateAccountBox from "./components/DeactivateAccountBox";
import type { AccountTabKey } from "./account.types";

export default function AccountPage() {
  const [tab, setTab] = useState<AccountTabKey>("profile");

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <AccountTabs value={tab} onChange={setTab} />

      <Box sx={{ mt: 3 }}>
        {tab === "profile" && <ProfileInfoForm />}
        {tab === "address" && <AddressList />}
        {tab === "security" && <DeactivateAccountBox />}
      </Box>
    </Box>
  );
}
