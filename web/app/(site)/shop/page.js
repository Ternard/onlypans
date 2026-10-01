import Link from "next/link";
import Image from "next/image";
import { payloadClient } from "@/lib/getPayload";
import { SHOP_TABS, imageOf, publicEvent, upcomingEventsWhere } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import TicketCard from "./TicketCard";
import SellTicketsForm from "./SellTicketsForm";

export const metadata = { title: "Shop" };

const INTROS = {
  tickets: "Tickets for Pans & Wine experiences and hand-picked partner events — paid securely online.",
  wearables: "Aprons, tees and caps for the ones who love good food as much as we do.",
  cookware: "The pans, boards and tools we actually cook with.",
  ebooks: "Our recipes, in your kitchen — downloadable eBooks plus free recipes to try tonight.",
};

function Empty({ children }) {
  return <p className="rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center text-ink/55">{children}</p>;
}

async function TicketsTab({ payload }) {
  const { docs } = await payload.find({ collection: "events", where: upcomingEventsWhere(), sort: "eventDate", limit: 100 });
  return (
    <>
      <div className="flex flex-col gap-5">
        {docs.map((e) => <TicketCard key={e.id} event={publicEvent(e)} />)}
        {docs.length === 0 && <Empty>No tickets on sale right now — check back soon.</Empty>}
      </div>

      <section id="sell" className="mt-20 grid scroll-mt-20 gap-10 overflow-hidden rounded-3xl bg-espresso p-6 text-cream sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:p-14">
        <div>
          <p className="eyebrow text-rose">For organisers</p>
          <h2 className="mt-3 text-4xl font-bold text-rose">Sell your tickets with us</h2>
          <p className="mt-4 leading-relaxed text-cream/75">
            Hosting a dinner, a tasting or a party? List it on Pans &amp; Wine and reach our food-loving community.
          </p>
          <ol className="mt-8 flex flex-col gap-5">
            {[
              ["Submit your event", "Tell us the date, venue, number of tickets and price."],
              ["We review & list it", "Once approved, your event goes live here in the Tickets tab."],
              ["Buyers pay online", "Payments and ticket counts are handled for you — no overselling."],
              ["You get paid", "We settle with you after the event, less an agreed commission."],
            ].map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose font-display text-sm font-bold text-espresso">{i + 1}</span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-cream/60">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl bg-cream p-6 text-ink sm:p-8">
          <SellTicketsForm />
        </div>
      </section>
    </>
  );
}

async function ProductsTab({ payload, category }) {
  const { docs } = await payload.find({
    collection: "products",
    where: { isAvailable: { equals: true }, category: { equals: category } },
    limit: 200,
  });
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {docs.map((p) => <ProductCard key={p.id} product={p} />)}
      {docs.length === 0 && <div className="col-span-full"><Empty>New pieces are on the way.</Empty></div>}
    </div>
  );
}

async function EbooksTab({ payload }) {
  const { docs: recipes } = await payload.find({
    collection: "recipes",
    where: { isPublished: { equals: true } },
    sort: "-createdAt",
    limit: 100,
  });
  return (
    <>
      <h2 className="mb-6 text-3xl font-bold">eBooks</h2>
      <ProductsTab payload={payload} category="ebooks" />

      <h2 className="mb-6 mt-16 text-3xl font-bold">Free recipes</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((r) => {
          const img = imageOf(r, "card");
          return (
            <Link key={r.id} href={`/recipes/${r.slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] bg-sand">
                {img && <Image src={img} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold">{r.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink/60">{r.description}</p>
              </div>
            </Link>
          );
        })}
        {recipes.length === 0 && <div className="col-span-full"><Empty>Recipes coming soon.</Empty></div>}
      </div>
    </>
  );
}

export default async function ShopPage({ searchParams }) {
  const { tab: requested } = await searchParams;
  const tab = SHOP_TABS.some((t) => t.key === requested) ? requested : "tickets";
  const payload = await payloadClient();

  return (
    <>
      <PageHeader eyebrow="Shop" title="Tickets, merch & more">
        {INTROS[tab]}
      </PageHeader>

      <div className="sticky top-16 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
        <nav aria-label="Shop sections" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {SHOP_TABS.map((t) => (
            <Link
              key={t.key}
              href={`/shop?tab=${t.key}`}
              scroll={false}
              aria-current={t.key === tab ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                t.key === tab ? "border-rose-deep text-ink" : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {tab === "tickets" && <TicketsTab payload={payload} />}
        {(tab === "wearables" || tab === "cookware") && <ProductsTab payload={payload} category={tab} />}
        {tab === "ebooks" && <EbooksTab payload={payload} />}
      </section>
    </>
  );
}
