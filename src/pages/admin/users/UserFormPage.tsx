import CrudFormPage from "@/components/crud/CrudFormPage";
import { userConfig } from "./user.config.tsx";
import { userApi } from "@/api/users";
import UserForm from "./components/UserForm";

// attach vào config để CrudFormPage biết form nào dùng
userConfig.formComponent = UserForm;

export default function UserFormPage() {
  return <CrudFormPage config={userConfig} api={userApi} />;
}
