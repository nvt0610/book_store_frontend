import CrudListPage from "@/components/crud/CrudListPage";
import { userConfig } from "./user.config.tsx";
import { userApi } from "@/api/users";
import UserTable from "./components/UserTable";

export default function UserListPage() {
  return (
    <CrudListPage
      config={userConfig}
      api={userApi}
      TableComponent={UserTable}
    />
  );
}
