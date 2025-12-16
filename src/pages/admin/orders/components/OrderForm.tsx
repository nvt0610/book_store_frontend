import { useEffect, useMemo, useState } from "react";
import { Box, Grid, TextField, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { userApi } from "@/api/users";
import { addressApi } from "@/api/addresses";
import { productApi } from "@/api/products";
import orderApi from "@/api/orders";

import { alertError, alertSuccess } from "@/utils/alert";
import { unwrapList } from "@/utils/unwrap";
import { validate } from "@/utils/validation";

import { useFormState } from "@/hooks/useFormState";
import { useFetchList } from "@/hooks/useFetchList";

import FormSection from "@/components/form/FormSection";
import FormSubmitBar from "@/components/form/FormSubmitBar";
import UserSelectPanel from "@/components/form/UserSelectPanel";
import AddressSelectPanel from "@/components/form/AddressSelectPanel";
import ProductSelectGrid from "@/components/form/ProductSelectGrid";

export default function OrderForm({ initialData }) {
  const navigate = useNavigate();
  const isEdit = Boolean(initialData);

  // ---------------------------
  // FORM STATE (CHUẨN)
  // ---------------------------
  const { form, setForm } = useFormState(initialData, {
    user_id: "",
    address_id: "",
    status: "PENDING",
    payment_method: "COD",
  });

  // ---------------------------
  // FETCH LIST
  // ---------------------------
  const { list: userList } = useFetchList(
    () => userApi.list({ page: 1, pageSize: 500 }).then(unwrapList),
    []
  );

  const { list: productList } = useFetchList(
    () =>
      productApi
        .list({ page: 1, pageSize: 500, showDeleted: "active" })
        .then(unwrapList),
    []
  );

  const { list: addressList, loading: addressLoading } = useFetchList(
    () =>
      form.user_id
        ? addressApi
            .list({ page: 1, pageSize: 500, user_id: form.user_id })
            .then(unwrapList)
        : [],
    [form.user_id]
  );

  // ---------------------------
  // SELECTED PRODUCTS
  // ---------------------------
  const initialSelected = useMemo(() => {
    if (!isEdit) return [];

    if (!initialData?.items) return [];

    return initialData.items.map((it) => {
      const p = productList.find((x) => x.id === it.product_id);
      return {
        product_id: it.product_id,
        name: p?.name || it.product_id,
        price: Number(it.price ?? p?.price ?? 0),
        quantity: Number(it.quantity ?? 1),
        stock: Number(p?.stock ?? 0),
      };
    });
  }, [isEdit, initialData, productList]);

  const [selected, setSelected] = useState(initialSelected);

  // ---------------------------
  // TOGGLE PRODUCT
  // ---------------------------
  const toggleProduct = (product) => {
    setSelected((prev) => {
      const exists = prev.find((x) => x.product_id === product.id);
      if (exists) {
        return prev.filter((x) => x.product_id !== product.id);
      }

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          quantity: 1,
          stock: Number(product.stock || 0),
        },
      ];
    });
  };

  const changeQuantity = (id, num) => {
    setSelected((prev) =>
      prev.map((it) => {
        if (it.product_id !== id) return it;
        const safe = Math.max(1, Math.min(it.stock || Infinity, num || 0));
        return { ...it, quantity: safe };
      })
    );
  };

  const totalAmount = useMemo(
    () =>
      selected.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [selected]
  );

  const formatVnd = (v) => `${v.toLocaleString("vi-VN")} đ`;

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async () => {
    try {
      validate.required(form.user_id, "User");
      validate.required(form.address_id, "Địa chỉ");

      if (selected.length === 0) {
        alertError("Vui lòng chọn sản phẩm");
        return;
      }

      if (!isEdit) {
        // CREATE ORDER
        const payload = {
          user_id: form.user_id,
          address_id: form.address_id,
          payment_method: form.payment_method,
          items: selected.map((it) => ({
            product_id: it.product_id,
            quantity: it.quantity,
            price: it.price,
          })),
        };

        await orderApi.createManual(payload);
        alertSuccess("Tạo đơn hàng thành công");
        navigate("/admin/orders");
        return;
      }

      // UPDATE ORDER
      if (initialData.status !== "PENDING") {
        alertError("Đơn hàng không thể cập nhật");
        return;
      }

      await orderApi.update(initialData.id, {
        address_id: form.address_id,
        status: form.status,
      });

      alertSuccess("Cập nhật đơn hàng thành công");
      navigate("/admin/orders");
    } catch (err) {
      alertError(err?.response?.data?.message || err.message);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <Box>
      {/* USER */}
      <FormSection title="Thông tin User">
        {!isEdit ? (
          <UserSelectPanel
            value={form.user_id}
            onChange={(id) =>
              setForm((p) => ({
                ...p,
                user_id: id,
                address_id: "",
              }))
            }
          />
        ) : (
          <TextField
            fullWidth
            disabled
            value={initialData.user?.full_name || ""}
          />
        )}
      </FormSection>

      {/* ADDRESS */}
      <FormSection title="Địa chỉ giao hàng">
        {form.user_id ? (
          <AddressSelectPanel
            userId={form.user_id}
            value={form.address_id}
            options={addressList}
            loading={addressLoading}
            onChange={(id) => setForm((p) => ({ ...p, address_id: id }))}
          />
        ) : (
          <Typography>Vui lòng chọn user trước</Typography>
        )}
      </FormSection>

      <FormSection title="Phương thức thanh toán">
        <TextField
          select
          fullWidth
          label="Payment method"
          value={form.payment_method}
          onChange={(e) =>
            setForm((p) => ({ ...p, payment_method: e.target.value }))
          }
        >
          <MenuItem value="COD">COD</MenuItem>
          <MenuItem value="MOMO">MOMO</MenuItem>
          <MenuItem value="VNPAY">VNPAY</MenuItem>
          <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
        </TextField>
      </FormSection>

      {/* PRODUCT */}
      <FormSection title="Chọn sản phẩm">
        <ProductSelectGrid
          items={productList}
          selected={selected.map((it) => it.product_id)}
          onToggle={toggleProduct}
        />

        <Typography fontWeight={700} mt={2}>
          Tổng tiền: {formatVnd(totalAmount)}
        </Typography>
      </FormSection>

      {/* SUBMIT */}
      <FormSubmitBar
        backUrl="/admin/orders"
        loading={false}
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
