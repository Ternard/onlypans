import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";
import Image from "next/image";

export default async function RecipePage({ params }) {
  const { brand: brandSlug, slug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "recipes",
    where: { slug: { equals: slug }, brand: { equals: brand.dbKey } },
    limit: 1,
  });
  const recipe = docs[0];
  if (!recipe) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {recipe.photo?.url && (
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl">
          <Image
            src={recipe.photo?.sizes?.hero?.url || recipe.photo.url}
            alt={recipe.title}
            fill
            priority
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{recipe.title}</h1>
      <p className="mt-2 text-black/60">{recipe.description}</p>

      <div className="mt-4 flex gap-4 text-sm font-semibold text-black/60">
        {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
        {recipe.servings && <span>Serves: {recipe.servings}</span>}
      </div>

      {recipe.ingredients?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Ingredients</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {recipe.ingredients.map((row, i) => (
              <li key={i} className="text-black/80">
                • {row.item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.steps?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Steps</h2>
          <ol className="mt-3 flex flex-col gap-3">
            {recipe.steps.map((row, i) => (
              <li key={i} className="text-black/80">
                <span className="font-bold" style={{ color: brand.accent }}>
                  {i + 1}.
                </span>{" "}
                {row.step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
