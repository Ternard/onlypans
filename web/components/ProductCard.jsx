"use client";

import { useState } from "react";
import Image from "next/image";
import { formatKsh } from "@/lib/currency";
import { useCart } from "@/lib/cart";
import { imageOf } from "@/lib/site";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const imageSrc = imageOf(product, "card");

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square w-full overflow-hidden bg-sand">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink/60">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-display text-lg font-semibold text-rose-deep">{formatKsh(product.price)}</p>
          <button
            type="button"
            onClick={handleAdd}
            className={`btn px-4 py-2 text-xs ${added ? "bg-green-700 text-white" : "btn-dark"}`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
