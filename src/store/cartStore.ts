import { create } from "zustand";
import { cartApi } from "@/api/cart";
import { cartItemApi } from "@/api/cartItem";
import { useAuthStore } from "./authStore";
import { useProductPreviewStore } from "./productPreviewStore";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
}

export interface Cart {
  id: string;
  status: "ACTIVE" | "INACTIVE";
  items: CartItem[];
}

export interface CartItemView extends CartItem {
  product?: {
    id: string;
    name: string;
    price: number;
    stock: number;
    main_image: string | null;
  };
  subtotal?: number;

  /** debug only */
  _debug?: {
    missingProduct?: boolean;
  };
}

interface CartState {
  cart: Cart | null;
  itemsView: CartItemView[];
  loading: boolean;

  loadCart: () => Promise<void>;
  addItem: (product_id: string, quantity: number) => Promise<void>;
  updateQty: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  itemCount: number;
  totalAmount: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  itemsView: [],
  loading: false,

  // =========================
  // DERIVED
  // =========================
  get itemCount() {
    return get().cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  },

  get totalAmount() {
    return get().itemsView.reduce((sum, it) => sum + (it.subtotal ?? 0), 0);
  },

  // =========================
  // CORE
  // =========================
  async loadCart() {
    set({ loading: true });

    try {
      const { user, accessToken } = useAuthStore.getState();

      let cart;

      if (user && accessToken) {
        // chỉ gọi /me khi token chắc chắn tồn tại
        cart = await cartApi.getMyCart();
      } else {
        let token = localStorage.getItem("guest_token");
        if (!token) {
          token = crypto.randomUUID();
          localStorage.setItem("guest_token", token);
        }
        cart = await cartApi.getOrCreateGuest({ guest_token: token });
      }

      const resolvedCart: Cart = cart.cart ?? cart;

      // ---------- DEBUG ----------
      console.debug("[Cart] raw cart", resolvedCart);

      set({ cart: resolvedCart });

      // =========================
      // ENRICH PRODUCT PREVIEW
      // =========================
      const productIds = resolvedCart.items.map((i) => i.product_id);

      console.debug("[Cart] productIds", productIds);

      const previewStore = useProductPreviewStore.getState();
      await previewStore.loadByIds(productIds);

      console.debug("[Cart] preview map", previewStore.map);

      const itemsView: CartItemView[] = resolvedCart.items.map((it) => {
        const p = previewStore.getById(it.product_id);

        // -------- FALLBACK --------
        if (!p) {
          console.warn(
            `[Cart] Missing product preview for product_id=${it.product_id}`
          );

          return {
            ...it,
            product: {
              id: it.product_id,
              name: "Sản phẩm không tồn tại",
              price: 0,
              main_image: null,
            },
            subtotal: 0,
            _debug: { missingProduct: true },
          };
        }

        const price = Number(p.price ?? 0);

        if (Number.isNaN(price)) {
          console.warn(`[Cart] Invalid price for product_id=${p.id}`, p.price);
        }

        const stock = Number(p.stock ?? 0);

        if (Number.isNaN(stock)) {
          console.warn(`[Cart] Invalid price for product_id=${p.id}`, p.stock);
        }

        return {
          ...it,
          product: {
            id: p.id,
            name: p.name,
            price,
            stock,
            main_image: p.main_image,
          },
          subtotal: price * it.quantity,
        };
      });

      console.debug("[Cart] itemsView", itemsView);
      console.debug(
        "[Cart] totalAmount",
        itemsView.reduce((s, i) => s + (i.subtotal ?? 0), 0)
      );

      set({ itemsView });
    } catch (err) {
      console.error("[Cart] loadCart failed", err);
      set({ itemsView: [] });
    } finally {
      set({ loading: false });
    }
  },

  // =========================
  // MUTATIONS
  // =========================
  async addItem(product_id, quantity) {
    let cart = get().cart;
    if (!cart) {
      await get().loadCart();
      cart = get().cart!;
    }

    const { user } = useAuthStore.getState();

    const payload: any = {
      cart_id: cart.id,
      product_id,
      quantity,
    };

    // ✅ GUEST → gửi guest_token
    if (!user) {
      const guest_token = localStorage.getItem("guest_token");
      if (!guest_token) {
        throw new Error("guest_token missing on addItem");
      }
      payload.guest_token = guest_token;
    }

    await cartItemApi.addItem(payload);
    await get().loadCart();
  },

  async updateQty(itemId, quantity) {
    await cartItemApi.updateQuantity(itemId, quantity);
    await get().loadCart();
  },

  async removeItem(itemId) {
    await cartItemApi.removeItem(itemId);
    await get().loadCart();
  },

  async clearCart() {
    const cart = get().cart;
    if (!cart) return;
    await cartItemApi.clear(cart.id);
    await get().loadCart();
  },
}));
