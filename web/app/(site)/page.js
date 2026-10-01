import Link from "next/link";
import Image from "next/image";
import { payloadClient } from "@/lib/getPayload";
import { SITE, imageOf, formatDate, galleryPhotos, upcomingEventsWhere } from "@/lib/site";
import { formatKsh } from "@/lib/currency";
import HeroCarousel from "@/components/HeroCarousel";

const OFFERINGS = [
  {
    title: "Buffet Spreads",
    text: "Generous, beautifully presented buffets — veg rice, chapati, mandazi, chevon dry & wet fry, kachumbari and fresh fruit platters.",
  },
  {
    title: "Private Dining",
    text: "An intimate chef's table at your home or venue, with plated courses, attentive service and a menu built around you.",
  },
  {
    title: "Wine & Beverages",
    text: "Curated wines, mocktails, fresh juices and proper Kenyan tea service, paired to every menu we cook.",
  },
  {
    title: "Event Catering",
    text: "Graduations, weddings, birthdays and corporate dinners for 10 to 500 guests — planned and run end to end.",
  },
];

export default async function HomePage() {
  const payload = await payloadClient();
  const [{ docs: heroDocs }, { docs: events }, { docs: galleryDocs }] = await Promise.all([
    payload.find({ collection: "hero-images", where: { isActive: { equals: true } }, sort: "displayOrder", limit: 10 }),
    payload.find({ collection: "events", where: upcomingEventsWhere(), sort: "eventDate", limit: 3 }),
    payload.find({ collection: "gallery", sort: "displayOrder", limit: 6 }),
  ]);

  const slides = heroDocs.map((d) => ({ id: d.id, imageUrl: imageOf(d, "hero") })).filter((d) => d.imageUrl);
  const photos = galleryPhotos(galleryDocs).slice(0, 6);

  return (
    <>
      <HeroCarousel images={slides} accent="#c4868b" dark="#1c110c">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow text-rose">Food &amp; Beverage · Private Chef · Events</p>
          <h1 className="font-display text-6xl font-bold leading-[0.9] tracking-[0.04em] text-rose sm:text-8xl lg:text-9xl">
            PANS<span className="text-cream/90">&amp;</span>WINE
          </h1>
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-cream/80 sm:text-base">by Only Pans</p>
          <p className="max-w-xl text-lg leading-relaxed text-cream/85 sm:text-xl">{SITE.tagline}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/services#book" className="btn btn-primary">Book Our Services</Link>
            <Link href="/shop" className="btn btn-ghost text-cream">Visit the Shop</Link>
          </div>
        </div>
      </HeroCarousel>
      <div className="gingham h-3" />

      {/* What we serve */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <p className="eyebrow">What we serve</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Food &amp; beverage, done beautifully.</h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              From a 100-guest graduation buffet to a quiet dinner for two, we bring the pans, the people and the
              polish — so you can enjoy your own event.
            </p>
            <Link href="/services" className="btn btn-dark mt-8">Explore Services</Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-2">
            {OFFERINGS.map((o, i) => (
              <div key={o.title} className="bg-cream p-7 transition hover:bg-sand">
                <span className="font-display text-sm font-semibold text-rose-deep">0{i + 1}</span>
                <h3 className="mt-3 text-2xl font-bold">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand promise, framed like the invoice */}
      <section className="gingham px-4 py-16 sm:py-24">
        <figure className="mx-auto max-w-3xl rounded-sm bg-cream px-6 py-12 text-center shadow-2xl shadow-black/20 sm:px-14 sm:py-16">
          <p className="eyebrow">The Pans &amp; Wine promise</p>
          <blockquote className="mt-5 font-display text-3xl font-semibold leading-snug text-rose-deep sm:text-4xl">
            &ldquo;We don&apos;t just cook — we curate unforgettable memories &amp; high-end luxury experiences.&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm uppercase tracking-[0.3em] text-ink/50">Only Pans</figcaption>
        </figure>
      </section>

      {/* Upcoming events */}
      {events.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Tickets on sale</p>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Upcoming events</h2>
            </div>
            <Link href="/shop?tab=tickets" className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-deep hover:text-brown">
              All tickets →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {events.map((e) => {
              const img = imageOf(e, "card");
              return (
                <Link key={e.id} href="/shop?tab=tickets" className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] bg-sand">
                    {img && <Image src={img} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                    <span className="absolute left-4 top-4 rounded-full bg-espresso/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream">
                      {formatDate(e.eventDate, { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{e.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{e.venue}</p>
                    <p className="mt-3 font-semibold text-rose-deep">{formatKsh(e.ticketPrice)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery peek */}
      {photos.length > 0 && (
      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Events gallery</p>
              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Moments we&apos;ve curated</h2>
            </div>
            <Link href="/gallery" className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-deep hover:text-brown">
              View gallery →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {photos.map((p, i) => (
              <div key={p.id} className={`relative overflow-hidden rounded-xl ${i === 0 ? "row-span-2 aspect-[4/5] md:aspect-auto" : "aspect-square"}`}>
                <Image src={p.src} alt={p.caption} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Closing CTA */}
      <section className="slats text-cream">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:py-28">
          <p className="eyebrow text-rose">Planning a celebration?</p>
          <h2 className="mt-4 text-4xl font-bold text-rose sm:text-6xl">Let&apos;s set the table.</h2>
          <p className="mt-5 max-w-xl text-cream/75">
            Tell us your date, guest count and the mood you&apos;re after. We&apos;ll come back with a menu, a quote and a
            shopping list.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/services#book" className="btn btn-primary">Request a Quote</Link>
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost text-cream">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  );
}
