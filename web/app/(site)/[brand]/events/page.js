import { getBrand, isValidBrand } from "@/lib/brands";
import { notFound } from "next/navigation";
import { payloadClient } from "@/lib/getPayload";
import EventCard from "./EventCard";

export default async function EventsPage({ params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  const payload = await payloadClient();
  const { docs: events } = await payload.find({
    collection: "events",
    where: { brand: { equals: brand.dbKey } },
    sort: "eventDate",
    limit: 200,
  });

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Events &amp; Tickets</h1>
      <p className="mt-2 text-black/60">Upcoming {brand.name} events.</p>

      <div className="mt-8 flex flex-col gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} brand={brand} />
        ))}
        {events.length === 0 && <p className="text-black/50">No upcoming events right now.</p>}
      </div>
    </section>
  );
}
