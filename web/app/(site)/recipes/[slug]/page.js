import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";
import { imageOf } from "@/lib/site";

export default async function RecipePage({ params }) {
  const { slug } = await params;
  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "recipes",
    where: { slug: { equals: slug }, isPublished: { equals: true } },
    limit: 1,
  });
  const recipe = docs[0];
  if (!recipe) notFound();
  const img = imageOf(recipe, "hero");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link href="/shop?tab=ebooks" className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-deep hover:text-brown">
        ← eBooks &amp; Recipes
      </Link>
      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">{recipe.title}</h1>
      {recipe.description && <p className="mt-3 text-lg leading-relaxed text-ink/65">{recipe.description}</p>}
      <div className="mt-5 flex gap-6 text-sm font-medium uppercase tracking-wider text-ink/55">
        {recipe.prepTime && <span>Prep · {recipe.prepTime}</span>}
        {recipe.servings && <span>Serves · {recipe.servings}</span>}
      </div>

      {img && (
        <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src={img} alt={recipe.title} fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
        </div>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.6fr]">
        {recipe.ingredients?.length > 0 && (
          <div className="gingham self-start rounded-sm p-2.5">
            <div className="bg-cream p-6">
              <h2 className="text-xl font-bold">Ingredients</h2>
              <ul className="mt-4 flex flex-col gap-2 text-ink/80">
                {recipe.ingredients.map((row, i) => <li key={i}>{row.item}</li>)}
              </ul>
            </div>
          </div>
        )}
        {recipe.steps?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Method</h2>
            <ol className="mt-4 flex flex-col gap-5">
              {recipe.steps.map((row, i) => (
                <li key={i} className="flex gap-4 leading-relaxed text-ink/80">
                  <span className="font-display text-2xl font-bold leading-none text-rose-deep">{i + 1}</span>
                  <span>{row.step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </article>
  );
}
