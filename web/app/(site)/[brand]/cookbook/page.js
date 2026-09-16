import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { payloadClient } from "@/lib/getPayload";

export default async function CookbookPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  const payload = await payloadClient();
  const [{ docs: recipes }, { docs: downloads }] = await Promise.all([
    payload.find({
      collection: "recipes",
      where: { brand: { equals: brand.dbKey }, isPublished: { equals: true } },
      sort: "-createdAt",
      limit: 100,
    }),
    payload.find({
      collection: "cookbook-downloads",
      where: { brand: { equals: brand.dbKey } },
      limit: 1,
    }),
  ]);
  const download = downloads[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Cookbook</h1>
          <p className="mt-2 max-w-xl text-black/60">
            Recipes from the {brand.name} kitchen.
          </p>
        </div>
        {download?.file?.url && (
          <a
            href={download.file.url}
            target="_blank"
            rel="noreferrer"
            className="self-start rounded-full px-6 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: brand.accent }}
          >
            Download the Cookbook
          </a>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/${brand.slug}/cookbook/${recipe.slug}`}
            className="overflow-hidden rounded-xl border border-black/5 shadow-sm transition hover:shadow-md"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-black/5">
              {recipe.photo?.url && (
                <Image
                  src={recipe.photo?.sizes?.card?.url || recipe.photo.url}
                  alt={recipe.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold">{recipe.title}</h2>
              <p className="mt-1 text-sm text-black/60 line-clamp-2">{recipe.description}</p>
            </div>
          </Link>
        ))}
        {recipes.length === 0 && (
          <p className="text-black/50">No recipes published yet.</p>
        )}
      </div>
    </section>
  );
}
