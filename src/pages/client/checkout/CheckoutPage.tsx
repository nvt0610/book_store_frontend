// src/pages/client/checkout/CheckoutPage.tsx
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CheckoutSteps from "./components/CheckoutSteps";
import CheckoutCartReview from "./components/CheckoutCartReview";
import CheckoutAddress from "./components/CheckoutAddress";
import CheckoutPayment from "./components/CheckoutPayment";
import CheckoutSummary from "./components/CheckoutSummary";
import CheckoutResult from "./components/CheckoutResult";

import checkoutService from "./checkout.service";
import type {
  CheckoutInitState,
  CheckoutPaymentMethod,
} from "./checkout.types";
import vnpayApi from "@/api/vnpay";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { alertError, alertSuccess } from "@/utils/alert";

type StepKey = "REVIEW" | "ADDRESS" | "PAYMENT" | "DONE";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);
  const itemsView = useCartStore((s) => s.itemsView);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadingCart = useCartStore((s) => s.loading);

  const init = location.state as CheckoutInitState | null;

  const [cartId, setCartId] = useState("");
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("COD");
  const [submitting, setSubmitting] = useState(false);
  const [resultOrderId, setResultOrderId] = useState("");
  const [activeStep, setActiveStep] = useState<StepKey>("REVIEW");

  // refs cho scroll
  const reviewRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    if (!init?.cart_id || !init?.item_ids?.length) {
      alertError("Dữ liệu thanh toán không hợp lệ");
      navigate("/cart");
      return;
    }

    setCartId(init.cart_id);
    setItemIds(init.item_ids);
    loadCart();
  }, []);

  useEffect(() => {
    if (!cartId) return;
    if (!cart?.id || cart.id !== cartId) loadCart();
  }, [cartId, cart?.id]);

  // =========================
  // DERIVED
  // =========================
  const selectedItems = useMemo(
    () => itemsView.filter((it) => itemIds.includes(it.id)),
    [itemsView, itemIds]
  );

  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (sum, it) => sum + Number(it.product?.price ?? 0) * it.quantity,
        0
      ),
    [selectedItems]
  );

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (submitting) return;

    if (!user) {
      alertError("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    if (!addressId) {
      alertError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      setSubmitting(true);

      // 1️⃣ CREATE ORDER (+ PAYMENT PENDING)
      const order = await checkoutService.checkoutFromCart({
        cart_id: cartId,
        address_id: addressId,
        item_ids: itemIds,
        payment_method: paymentMethod,
      });

      // ======================
      // COD FLOW
      // ======================
      if (paymentMethod === "COD") {
        setResultOrderId(order.id);
        setActiveStep("DONE");
        doneRef.current?.scrollIntoView({ behavior: "smooth" });
        alertSuccess("Đặt hàng thành công");
        return;
      }

      // ======================
      // VNPAY FLOW
      // ======================
      if (paymentMethod === "VNPAY") {
        // 2️⃣ CREATE VNPAY URL (DÙNG order_id)
        const vnpay = await vnpayApi.createPaymentUrl({
          order_id: order.id,
        });

        // 3️⃣ REDIRECT USER
        window.location.href = vnpay.paymentUrl;
        return;
      }
    } catch (err: any) {
      alertError(err?.message || "Thanh toán thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Thanh toán
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* LEFT */}
        <CheckoutSteps
          active={activeStep}
          showDone={!!resultOrderId}
          onGo={(s) => {
            setActiveStep(s);
            const map = {
              REVIEW: reviewRef,
              ADDRESS: addressRef,
              PAYMENT: paymentRef,
              DONE: doneRef,
            };
            map[s]?.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* RIGHT */}
        <Box>
          <Box ref={reviewRef} mb={4}>
            <CheckoutCartReview
              loading={loadingCart}
              items={selectedItems}
              itemCount={itemIds.length}
              totalAmount={totalAmount}
              onBack={() => navigate("/cart")}
            />
          </Box>

          <Box ref={addressRef} mb={4}>
            <CheckoutAddress
              userId={user?.id || ""}
              value={addressId}
              onChange={setAddressId}
            />
          </Box>

          <Box ref={paymentRef} mb={4}>
            <CheckoutPayment
              value={paymentMethod}
              onChange={setPaymentMethod}
            />

            <CheckoutSummary
              totalAmount={totalAmount}
              submitting={submitting}
              canSubmit={!!addressId}
              onSubmit={handleSubmit}
            />
          </Box>

          {resultOrderId && (
            <Box ref={doneRef}>
              <CheckoutResult
                orderId={resultOrderId}
                onGoHome={() => navigate("/")}
                onGoCart={() => navigate("/cart")}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
