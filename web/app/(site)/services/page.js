import { SITE } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import { payloadClient } from "@/lib/getPayload";
import BookingForm from "./BookingForm";

export const metadata = { title: "Services" };

const STEPS = [
  { title: "Tell us the occasion", text: "Share your date, guest count and the experience you have in mind." },
  { title: "Get your quote & list", text: "We send an itemised invoice — and a shopping list if you're supplying ingredients." },
  { title: "We cook & curate", text: "Our team arrives, cooks fresh on site and serves. You enjoy your guests." },
];

const SAMPLE_MENU = ["Veg rice", "Chapati", "Mandazi", "Chevon dry / wet fry", "Kachumbari", "Kenyan tea", "Pineapple & melon platters"];

export default async function ServicesPage() {
  const payload = await payloadClient();
  const { docs: services } = await payload.find({ collection: "services", where: { isPublished: { not_equals: false } }, sort: "displayOrder", limit: 50, pagination: false });
  const { docs: menu } = await payload.find({ collection: "menu-items", where: { isAvailable: { not_equals: false } }, sort: "name", limit: 200, pagination: false });
  return (
    <>
      <PageHeader eyebrow="Services" title="Food & beverage for every occasion">
        Catering, private chefs and beverage service — each one cooked fresh, served beautifully and planned around you.
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <article key={s.id} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/5 sm:p-10">
              <span className="font-display text-sm font-semibold text-rose-deep">0{i + 1}</span>
              <h2 className="mt-3 text-3xl font-bold">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-ink/70">{s.text}</p>
              <ul className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-6 text-sm">
                {(s.points || []).map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-deep" />
                    {p.point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-center">How it works</p>
          <h2 className="mt-3 text-center text-4xl font-bold sm:text-5xl">Three steps to the table</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-espresso font-display text-xl font-bold text-rose">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="book" className="mx-auto grid max-w-7xl scroll-mt-20 gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <p className="eyebrow">Book us</p>
          <h2 className="mt-3 text-4xl font-bold sm:text-5xl">Request a quote</h2>
          <p className="mt-4 leading-relaxed text-ink/70">
            Fill in what you know — we&apos;ll handle the rest. Prefer to chat?{" "}
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="font-semibold text-rose-deep underline underline-offset-4">
              WhatsApp {SITE.phone}
            </a>
            .
          </p>
          <div className="gingham mt-10 rounded-sm p-3">
            <div className="bg-cream px-6 py-7">
              <p className="eyebrow">Sample buffet · 100 pax</p>
              <ul className="mt-4 flex flex-col gap-1.5 text-ink/75">
                {SAMPLE_MENU.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-10">
          <BookingForm menu={menu.map((m) => ({ name: m.name, category: m.category }))} />
        </div>
      </section>
    </>
  );
}
