import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountTabs from "./components/AccountTabs";
import ProfileInfoForm from "./components/ProfileInfoForm";
import AddressSection from "./sections/AddressSection";
import DeactivateAccountBox from "./components/DeactivateAccountBox";

import type { AccountTabKey } from "./account.types";

export default function AccountPage() {
  const [tab, setTab] = useState<AccountTabKey>("profile");
  const navigate = useNavigate();

  const handleTabChange = (v: AccountTabKey) => {
    if (v === "orders") {
      navigate("/orders");
      return;
    }
    setTab(v);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <AccountTabs value={tab} onChange={handleTabChange} />

      <Box sx={{ mt: 3 }}>
        {tab === "profile" && <ProfileInfoForm />}
        {tab === "address" && <AddressSection />}
        {tab === "security" && <DeactivateAccountBox />}
      </Box>
    </Box>
  );
}
