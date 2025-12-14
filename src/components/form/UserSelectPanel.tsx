import { Box, Typography, TextField, Radio } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { userApi } from "@/api/users";
import { unwrapList } from "@/utils/unwrap";
import { alertError } from "@/utils/alert";

export default function UserSelectPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await userApi.list({ pageSize: 500 });
        setUsers(unwrapList(res).filter((u: any) => u.status === "ACTIVE"));
      } catch {
        alertError("Không tải được danh sách user");
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography fontWeight={600}>Chọn user</Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Tìm user…"
        sx={{ my: 1 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
        {filtered.map((u) => (
          <Box
            key={u.id}
            sx={{
              py: 1,
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Radio checked={value === u.id} onChange={() => onChange(u.id)} />
            <Box>
              <Typography fontWeight={600}>{u.full_name}</Typography>
              <Typography fontSize={13} color="text.secondary">
                {u.email}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
