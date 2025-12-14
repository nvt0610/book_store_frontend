import axiosClient from "@/api/axiosClient";
import { authApi } from "@/api/auth";

export default function TestPage() {

  const handleLogin = async () => {
    try {
      console.log("==== LOGIN ====");
      const res = await authApi.login("nvt0610@gmail.com", "123456");
      console.log("Login result:", res);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const callProtectedApi = async () => {
    try {
      console.log("==== CALL /users ====");
      const users = await axiosClient.get("/users");
      console.log("Users =", users);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={handleLogin}
        style={{ marginRight: 10, padding: "10px 20px" }}
      >
        Login
      </button>

      <button
        onClick={callProtectedApi}
        style={{ padding: "10px 20px" }}
      >
        Call Protected API
      </button>
    </div>
  );
}
