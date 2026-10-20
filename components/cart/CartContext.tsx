"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProduct, type CivilizationKey } from "@/config/store";

export type CartLine = {
  slug: CivilizationKey;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (slug: CivilizationKey, qty?: number) => void;
  remove: (slug: CivilizationKey) => void;
  setQty: (slug: CivilizationKey, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "3weeq.cart.v1";
const CHANGE_EVENT = "3weeq.cart.change";

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

/** Read the raw stored string (a stable primitive snapshot). */
function readRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parseLines(raw: string): CartLine[] {
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l) => typeof l?.slug === "string" && typeof l?.qty === "number" && l.qty > 0
    );
  } catch {
    return [];
  }
}

/**
 * Cart — Context + `localStorage` (MASTER-PLAN §5.1: no server yet).
 *
 * The stored string is the external source of truth, read through
 * `useSyncExternalStore` (the same pattern the hero uses for its capability
 * probe): the server snapshot is `"[]"`, the client subscribes to `storage`
 * (other tabs) and a same-tab `cart:change` event, and every write commits to
 * `localStorage` then notifies — so no setState-in-effect and no hydration
 * mismatch.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(CHANGE_EVENT, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(CHANGE_EVENT, onStoreChange);
      };
    },
    readRaw,
    () => "[]"
  );

  const [isOpen, setIsOpen] = useState(false);

  const lines = useMemo(() => parseLines(raw), [raw]);

  const commit = useCallback((next: CartLine[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const add = useCallback(
    (slug: CivilizationKey, qty = 1) => {
      const prev = parseLines(readRaw());
      const existing = prev.find((l) => l.slug === slug);
      const next = existing
        ? prev.map((l) =>
            l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 99) } : l
          )
        : [...prev, { slug, qty }];
      commit(next);
      window.dispatchEvent(
        new CustomEvent("cart:added", { detail: { slug, at: Date.now() } })
      );
    },
    [commit]
  );

  const remove = useCallback(
    (slug: CivilizationKey) => {
      commit(parseLines(readRaw()).filter((l) => l.slug !== slug));
    },
    [commit]
  );

  const setQty = useCallback(
    (slug: CivilizationKey, qty: number) => {
      const prev = parseLines(readRaw());
      const next =
        qty <= 0
          ? prev.filter((l) => l.slug !== slug)
          : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 99) } : l));
      commit(next);
    },
    [commit]
  );

  const clear = useCallback(() => commit([]), [commit]);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => {
      const p = getProduct(l.slug);
      return sum + (p ? p.price * l.qty : 0);
    }, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      add,
      remove,
      setQty,
      clear,
    };
  }, [lines, isOpen, openCart, closeCart, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
