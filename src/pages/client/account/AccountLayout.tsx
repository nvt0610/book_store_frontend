export default function AccountLayout() {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <AccountTabs />
      <Box sx={{ mt: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
