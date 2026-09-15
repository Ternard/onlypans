import { formatKsh } from "@/lib/currency";

export default function ProductCard({ product, accent }) {
  const imageSrc = product.photo?.url || product.imageUrl;
  return (
    <div className="group overflow-hidden rounded-xl border border-black/5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-4/3 w-full overflow-hidden bg-black/5">
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="mt-1 text-sm text-black/60 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-lg font-extrabold" style={{ color: accent }}>
          {formatKsh(product.price)}
        </p>
      </div>
    </div>
  );
}
