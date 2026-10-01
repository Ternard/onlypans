import Link from "next/link";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/site";
import Logo from "@/components/Logo";
import SocialIcon from "@/components/SocialIcon";

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream">
      <div className="gingham h-3" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col items-start gap-4">
          <Logo size="lg" />
          <p className="max-w-sm text-sm leading-relaxed text-cream/60">{SITE.tagline}</p>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} ${s.handle}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/80 transition hover:border-rose hover:text-rose"
              >
                <SocialIcon name={s.key} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-rose">Explore</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/70 hover:text-rose">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-rose">Get in touch</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cream/70">
            <li><a href={SITE.whatsapp} className="hover:text-rose">WhatsApp {SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="break-all hover:text-rose">{SITE.email}</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs tracking-wide text-cream/40">
        © {new Date().getFullYear()} {SITE.name} {SITE.byline}. All rights reserved.
      </p>
    </footer>
  );
}
