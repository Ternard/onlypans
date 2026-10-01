import { SITE, SOCIALS } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import SocialIcon from "@/components/SocialIcon";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  const direct = [
    { key: "phone", label: "WhatsApp us", value: SITE.phone, href: SITE.whatsapp },
    { key: "email", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <>
      <PageHeader eyebrow="Contact us" title="Let's talk food">
        Bookings, quotes, partnerships or just a hello — reach us wherever is easiest for you.
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.3fr] lg:px-8">
        <div className="flex flex-col gap-5">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-5 rounded-2xl bg-espresso p-6 text-cream transition hover:-translate-y-1 hover:shadow-xl sm:p-8"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose text-espresso">
              <SocialIcon name="whatsapp" className="h-7 w-7" />
            </span>
            <span>
              <span className="eyebrow block text-rose">Fastest reply</span>
              <span className="mt-1 block font-display text-2xl font-bold">Chat on WhatsApp</span>
              <span className="text-sm text-cream/65">{SITE.phone}</span>
            </span>
          </a>

          {direct.map((d) => (
            <a key={d.key} href={d.href} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/5 transition hover:ring-rose">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-rose-deep">
                <SocialIcon name={d.key} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-[0.2em] text-ink/50">{d.label}</span>
                <span className="block break-all font-semibold">{d.value}</span>
              </span>
            </a>
          ))}

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <p className="eyebrow">Follow along</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {SOCIALS.filter((s) => s.key !== "whatsapp").map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-sand">
                    <SocialIcon name={s.key} className="h-5 w-5 text-rose-deep" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{s.label}</span>
                      <span className="block truncate text-xs text-ink/55">{s.handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5 sm:p-10">
          <h2 className="text-3xl font-bold">Send us a message</h2>
          <p className="mt-2 text-sm text-ink/60">We usually reply within a day.</p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
