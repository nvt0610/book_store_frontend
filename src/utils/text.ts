export const truncate = (str: string, len = 14) => {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
};
