import Link from "next/link";
import { NAV_LINKS } from "@/lib/brands";

export default function Footer({ brand }) {
  return (
    <footer className="text-white" style={{ backgroundColor: brand.dark }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:flex-row sm:justify-between lg:px-8">
        <div>
          <p className="text-lg font-extrabold">{brand.name}</p>
          <p className="mt-1 text-sm opacity-70">{brand.tagline}</p>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={`/${brand.slug}/${link.href}`} className="opacity-80 hover:opacity-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={brand.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold opacity-80 hover:opacity-100"
        >
          Instagram
        </a>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {brand.name}. All rights reserved.
      </p>
    </footer>
  );
}
