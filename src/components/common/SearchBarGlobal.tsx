// frontend/src/components/common/SearchBarGlobal.tsx
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { searchApi } from "@/api/search";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchBarGlobal() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);
  const timeoutRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const clientRouteMap: Record<string, (id: string) => string> = {
    products: (id) => `/product/${id}`,
    authors: (id) => `/author/${id}`,
    publishers: (id) => `/publisher/${id}`,
  };

  const clearSearch = () => {
    setValue("");
    setSuggestions(null);
    inputRef.current?.focus();
  };

  // ============================
  // Debounce search
  // ============================
  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions(null);
      return;
    }

    try {
      setLoading(true);
      const res = await searchApi.search(keyword);
      setSuggestions(res);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: any) => {
    const val = e.target.value;
    setValue(val);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleSearch(val);
    }, 350);
  };

  // ============================
  // Click outside → hide dropdown
  // ============================
  const wrapperRef = useRef<any>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;

    navigate(`/search?q=${value}`);
    clearSearch();
  };

  useEffect(() => {
    setValue("");
    setSuggestions(null);
    const clickOutside = (e: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions(null);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [location.pathname]);

  // ============================
  // Render one suggestion group
  // ============================
  const renderGroup = (title: string, items: any[], resource: string) => {
    if (!items || items.length === 0) return null;

    const toRoute = clientRouteMap[resource];
    if (!toRoute) return null;

    return (
      <Box sx={{ mb: 1 }}>
        <Box sx={{ px: 1.5, py: 0.5, fontSize: 13, fontWeight: 700 }}>
          {title}
        </Box>

        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              px: 1.5,
              py: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
            onClick={() => {
              navigate(toRoute(item.id));
              setSuggestions(null);
            }}
          >
            {item.name}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ position: "relative" }} ref={wrapperRef}>
      <TextField
        value={value}
        onChange={onChange}
        placeholder="Tìm sách, tác giả, nhà xuất bản..."
        size="small"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "30px",
            backgroundColor: "#fff",
          },
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {/* ❌ CLEAR */}
              {value && (
                <IconButton size="small" onClick={clearSearch} sx={{ mr: 0.5 }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}

              {/* 🔍 SEARCH */}
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton onClick={handleSubmit} disabled={loading}>
                  <SearchIcon sx={{ color: "#d32f2f" }} />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />

      {/* ================= */}
      {/* DROPDOWN RESULT */}
      {/* ================= */}
      {suggestions && (
        <Box
          sx={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "100%",
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            zIndex: 30,
            maxHeight: 380,
            overflowY: "auto",
            py: 1,
          }}
        >
          {renderGroup("Sản phẩm", suggestions.products, "products")}
          {renderGroup("Tác giả", suggestions.authors, "authors")}
          {renderGroup("Nhà xuất bản", suggestions.publishers, "publishers")}

          {suggestions.products.length +
            suggestions.authors.length +
            suggestions.publishers.length ===
            0 && (
            <Box sx={{ py: 2, textAlign: "center", color: "#888" }}>
              Không tìm thấy kết quả
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
