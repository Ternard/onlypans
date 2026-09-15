"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/brands";

export default function Nav({ brand }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 text-white backdrop-blur-md"
      style={{
        backgroundImage: `linear-gradient(180deg, ${brand.dark}e6, ${brand.dark}b3)`,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${brand.slug}`} className="text-lg font-extrabold tracking-wide">
          {brand.name}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${brand.slug}/${link.href}`}
              className="group relative text-sm font-semibold uppercase tracking-wide opacity-90 transition hover:opacity-100"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: brand.accent }}
              />
            </Link>
          ))}
          <a
            href={`/${brand.switchTo}`}
            className="rounded-full px-4 py-1.5 text-sm font-bold shadow-md shadow-black/30 transition hover:-translate-y-0.5"
            style={{ backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
          >
            {brand.switchLabel}
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-md"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="white" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="1.8" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
            </svg>
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md"
          >
            <span
              className="h-0.5 w-6 bg-white transition-transform"
              style={{ transform: open ? "translateY(8px) rotate(45deg)" : "none" }}
            />
            <span
              className="h-0.5 w-6 bg-white transition-opacity"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="h-0.5 w-6 bg-white transition-transform"
              style={{ transform: open ? "translateY(-8px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${brand.slug}/${link.href}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-sm font-semibold uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`/${brand.switchTo}`}
            className="mt-2 rounded-full px-4 py-2 text-center text-sm font-bold shadow-md shadow-black/30"
            style={{ backgroundImage: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
          >
            {brand.switchLabel}
          </a>
        </nav>
      )}
    </header>
  );
}
