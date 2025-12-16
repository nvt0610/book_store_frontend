// src/pages/client/checkout/CheckoutPage.tsx
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CheckoutSteps from "./components/CheckoutSteps";
import CheckoutCartReview from "./components/CheckoutCartReview";
import CheckoutAddress from "./components/CheckoutAddress";
import CheckoutPayment from "./components/CheckoutPayment";
import CheckoutSummary from "./components/CheckoutSummary";
import addressApi from "@/api/addresses";
import paymentApi from "@/api/payments";
import checkoutService from "./checkout.service";
import { unwrapList } from "@/utils/unwrap";
import type {
  CheckoutInitState,
  CheckoutPaymentMethod,
} from "./checkout.types";
import vnpayApi from "@/api/vnpay";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { alertError } from "@/utils/alert";
import orderDetailService from "../orders/orderDetail.service";

type StepKey = "REVIEW" | "ADDRESS" | "PAYMENT";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);
  const itemsView = useCartStore((s) => s.itemsView);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadingCart = useCartStore((s) => s.loading);

  const init = location.state as CheckoutInitState | null;

  const [mode, setMode] = useState<"CART" | "ORDER">("CART");

  // CART mode
  const [cartId, setCartId] = useState("");
  const [itemIds, setItemIds] = useState<string[]>([]);

  // ORDER mode
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderId, setOrderId] = useState("");

  const [addressId, setAddressId] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("COD");
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<StepKey>("REVIEW");

  const reviewRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  const isResult = location.pathname.startsWith("/checkout/result");

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    if (isResult) return;

    if (!init) {
      alertError("Dữ liệu thanh toán không hợp lệ");
      navigate("/cart");
      return;
    }

    // ===== CART MODE (GIỮ NGUYÊN) =====
    if ("cart_id" in init) {
      setMode("CART");
      setCartId(init.cart_id);
      setItemIds(init.item_ids);
      loadCart();
      return;
    }

    // ===== ORDER MODE (MỚI) =====
    if ("order_id" in init) {
      setMode("ORDER");
      setOrderId(init.order_id);

      orderDetailService.getById(init.order_id).then((order) => {
        if (!order) {
          alertError("Không tìm thấy đơn hàng");
          navigate("/orders");
          return;
        }

        setOrderItems(
          order.items.map((it) => ({
            id: it.id,
            quantity: it.quantity,
            product: it.product,
            subtotal: Number(it.price) * it.quantity,
          }))
        );
      });
    }
  }, [isResult]);

  // reload cart nếu lệch
  useEffect(() => {
    if (mode !== "CART") return;
    if (!cartId) return;
    if (!cart?.id || cart.id !== cartId) loadCart();
  }, [cartId, cart?.id, mode]);

  // tự động tick chọn địa chỉ mặc định
  useEffect(() => {
    if (!user?.id || isResult) return;

    let mounted = true;

    (async () => {
      try {
        setLoadingAddresses(true);

        const res = await addressApi.list({ pageSize: 100 });
        const list = unwrapList(res);

        if (!mounted) return;

        setAddresses(list);

        // ✅ AUTO-SELECT ĐÚNG THỜI ĐIỂM
        if (!addressId && list.length) {
          const defaults = list.filter((a) => a.is_default);

          if (defaults.length >= 1) {
            // ưu tiên default mới nhất
            const chosen =
              defaults.length === 1
                ? defaults[0]
                : defaults.sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )[0];

            setAddressId(chosen.id);
          }
        }
      } catch (err) {
        console.error("[CheckoutPage] load addresses failed", err);
      } finally {
        setLoadingAddresses(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.id, isResult]); // ❗ KHÔNG phụ thuộc addressId

  // =========================
  // DERIVED
  // =========================
  const selectedItems = useMemo(() => {
    if (mode === "CART") {
      return itemsView.filter((it) => itemIds.includes(it.id));
    }
    return orderItems;
  }, [mode, itemsView, itemIds, orderItems]);

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

    if (mode === "CART" && !addressId) {
      alertError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      setSubmitting(true);

      // =========================
      // ORDER: PAY EXISTING ORDER
      // =========================
      if (mode === "ORDER") {
        if (paymentMethod === "COD") {
          await paymentApi.retryPayment(orderId, "COD");
          navigate(`/checkout/result?success=1&code=COD&order_id=${orderId}`);
          return;
        }

        if (paymentMethod === "VNPAY") {
          const payment = await paymentApi.retryPayment(orderId, "VNPAY");

          const vnpay = await vnpayApi.createPaymentUrl({
            order_id: orderId,
            payment_id: payment.id,
          });

          window.location.href = vnpay.paymentUrl;
          return;
        }

        return;
      }

      // =========================
      // CART: CREATE NEW ORDER
      // =========================
      const order = await checkoutService.checkoutFromCart({
        cart_id: cartId,
        address_id: addressId,
        item_ids: itemIds,
        payment_method: paymentMethod,
      });

      if (!order) {
        throw new Error("Không tạo được đơn hàng");
      }

      if (paymentMethod === "COD") {
        navigate(`/checkout/result?success=1&code=COD&order_id=${order.id}`);
        return;
      }

      if (paymentMethod === "VNPAY") {
        const vnpay = await vnpayApi.createPaymentUrl({
          order_id: order.id,
        });

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
        }}
      >
        <CheckoutSteps
          active={activeStep}
          onGo={(s) => {
            setActiveStep(s);
            const map = {
              REVIEW: reviewRef,
              ADDRESS: addressRef,
              PAYMENT: paymentRef,
            };
            map[s]?.current?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <Box>
          <Box ref={reviewRef} mb={4}>
            <CheckoutCartReview
              loading={loadingCart}
              items={selectedItems}
              itemCount={selectedItems.length}
              totalAmount={totalAmount}
              onBack={() => navigate("/cart")}
            />
          </Box>

          <Box ref={addressRef} mb={4}>
            <CheckoutAddress
              userId={user?.id || ""}
              value={addressId}
              addresses={addresses}
              loading={loadingAddresses}
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
        </Box>
      </Box>
    </Box>
  );
}
