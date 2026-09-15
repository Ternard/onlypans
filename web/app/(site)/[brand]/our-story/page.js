import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";

export default async function OurStoryPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  const payload = await payloadClient();
  const { docs } = await payload.find({
    collection: "our-story",
    where: { brand: { equals: brand.dbKey } },
    limit: 1,
  });
  const story = docs[0];
  const imageSrc = story?.photo?.url || story?.imageUrl;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Our Story</h1>

      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={brand.name}
          className="mt-6 aspect-16/9 w-full rounded-xl object-cover"
        />
      )}

      <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-black/70 sm:text-lg">
        {story?.body ? (
          story.body.split("\n").map((paragraph, i) => paragraph.trim() && <p key={i}>{paragraph}</p>)
        ) : (
          <>
            <p>
              {brand.name} started with one smoker, one neighborhood, and a
              commitment to doing barbecue the slow, honest way &mdash; low heat,
              real wood, no shortcuts.
            </p>
            <p>
              Every plate that leaves our kitchen carries that same standard,
              whether it&apos;s a weeknight pickup order or a full catering
              spread for a hundred guests.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
