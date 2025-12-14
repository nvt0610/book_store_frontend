// src/utils/currency.ts
export const formatCurrency = (value: any) => {
  if (value == null) return "-";
  const num = Number(value);
  return Number.isNaN(num) ? String(value) : num.toLocaleString("vi-VN") + " đ";
};
