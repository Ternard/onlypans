"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "pansandwine-cart";
let snapshotCache = null;
const EMPTY = [];
const getServerSnapshot = () => EMPTY;

function readStore() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  const parsed = readStore();
  if (snapshotCache && JSON.stringify(snapshotCache) === JSON.stringify(parsed)) {
    return snapshotCache;
  }
  snapshotCache = parsed;
  return parsed;
}

function writeStore(items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(STORAGE_KEY));
}

function subscribe(callback) {
  window.addEventListener(STORAGE_KEY, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORAGE_KEY, callback);
    window.removeEventListener("storage", callback);
  };
}

export function CartProvider({ children }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const api = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem(product, quantity = 1) {
        const current = readStore();
        const existing = current.find((item) => item.productId === product.id);
        const next = existing
          ? current.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [
              ...current,
              { productId: product.id, name: product.name, price: Number(product.price), quantity },
            ];
        writeStore(next);
      },
      setQuantity(productId, quantity) {
        const current = readStore();
        const next =
          quantity <= 0
            ? current.filter((item) => item.productId !== productId)
            : current.map((item) => (item.productId === productId ? { ...item, quantity } : item));
        writeStore(next);
      },
      removeItem(productId) {
        writeStore(readStore().filter((item) => item.productId !== productId));
      },
      clear() {
        writeStore([]);
      },
    }),
    [items]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
