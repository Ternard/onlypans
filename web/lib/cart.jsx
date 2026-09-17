"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const CartContext = createContext(null);
const snapshotCache = new Map();

function storageKey(brandSlug) {
  return `onlypans-cart-${brandSlug}`;
}

function parseStore(brandSlug) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(brandSlug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readStore(brandSlug) {
  return parseStore(brandSlug);
}

function getSnapshot(brandSlug) {
  const parsed = parseStore(brandSlug);
  const cached = snapshotCache.get(brandSlug);
  if (cached && JSON.stringify(cached) === JSON.stringify(parsed)) {
    return cached;
  }
  snapshotCache.set(brandSlug, parsed);
  return parsed;
}

function writeStore(brandSlug, items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(brandSlug), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(storageKey(brandSlug)));
}

function subscribe(brandSlug, callback) {
  const key = storageKey(brandSlug);
  window.addEventListener(key, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(key, callback);
    window.removeEventListener("storage", callback);
  };
}

export function CartProvider({ brandSlug, children }) {
  const items = useSyncExternalStore(
    (callback) => subscribe(brandSlug, callback),
    () => getSnapshot(brandSlug),
    () => []
  );

  const api = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem(product, quantity = 1) {
        const current = readStore(brandSlug);
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
        writeStore(brandSlug, next);
      },
      setQuantity(productId, quantity) {
        const current = readStore(brandSlug);
        const next =
          quantity <= 0
            ? current.filter((item) => item.productId !== productId)
            : current.map((item) => (item.productId === productId ? { ...item, quantity } : item));
        writeStore(brandSlug, next);
      },
      removeItem(productId) {
        writeStore(brandSlug, readStore(brandSlug).filter((item) => item.productId !== productId));
      },
      clear() {
        writeStore(brandSlug, []);
      },
    }),
    [items, brandSlug]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
