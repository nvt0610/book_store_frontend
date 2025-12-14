// src/pages/client/checkout/components/CheckoutSteps.tsx
import { Box, Typography } from "@mui/material";

type StepKey = "REVIEW" | "ADDRESS" | "PAYMENT";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "REVIEW", label: "Sản phẩm" },
  { key: "ADDRESS", label: "Địa chỉ" },
  { key: "PAYMENT", label: "Thanh toán" },
];

export default function CheckoutSteps({
  active,
  onGo,
  showDone,
}: {
  active: StepKey;
  onGo: (s: StepKey) => void;
  showDone: boolean;
}) {
  return (
    <Box sx={{ borderLeft: "2px solid #eee", pl: 2, position: "sticky", top: 80 }}>
      {STEPS.filter((s) => s.key !== "DONE" || showDone).map((s) => (
        <Box
          key={s.key}
          onClick={() => s.key !== "DONE" && onGo(s.key)}
          sx={{
            mb: 2,
            cursor: s.key === "DONE" ? "default" : "pointer",
            opacity: s.key === "DONE" ? 0.6 : 1,
          }}
        >
          <Typography
            fontWeight={s.key === active ? 700 : 500}
            color={s.key === active ? "primary" : "text.primary"}
          >
            ● {s.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
