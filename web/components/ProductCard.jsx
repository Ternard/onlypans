"use client";

import { useState } from "react";
import Image from "next/image";
import { formatKsh } from "@/lib/currency";
import { useCart } from "@/lib/cart";

export default function ProductCard({ product, accent }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const imageSrc = product.photo?.sizes?.card?.url || product.photo?.url || product.imageUrl;

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-black/5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-black/5">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="mt-1 text-sm text-black/60 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold" style={{ color: accent }}>
            {formatKsh(product.price)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
            style={{ backgroundColor: added ? "#16a34a" : accent }}
          >
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
