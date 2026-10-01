"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { useCart } from "@/lib/cart";
import Logo from "@/components/Logo";

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart (${count} items)`} className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-espresso">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-espresso/95 text-cream backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium uppercase tracking-[0.14em] transition hover:text-rose ${
                isActive(pathname, link.href) ? "text-rose" : "text-cream/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/services#book" className="btn btn-primary hidden px-5 py-2.5 sm:inline-flex">
            Book Us
          </Link>
          <CartLink />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full hover:bg-white/10 lg:hidden"
          >
            <span className={`h-0.5 w-5 bg-cream transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-cream transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-cream transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/10 px-4 pb-5 pt-2 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`border-b border-white/5 py-3.5 text-sm font-medium uppercase tracking-[0.14em] ${
                isActive(pathname, link.href) ? "text-rose" : "text-cream/85"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/services#book" onClick={() => setOpen(false)} className="btn btn-primary mt-4">
            Book Us
          </Link>
        </nav>
      )}
    </header>
  );
}
