import Link from "next/link";

export default function Logo({ size = "sm" }) {
  const big = size === "lg";
  return (
    <Link href="/" className="inline-flex flex-col items-center leading-none text-rose">
      <span className={`font-display font-bold tracking-[0.08em] ${big ? "text-3xl" : "text-xl"}`}>
        PANS&amp;WINE
      </span>
      <span className={`mt-1 font-medium uppercase tracking-[0.32em] ${big ? "text-[0.7rem]" : "text-[0.55rem]"} text-cream/70`}>
        by Only Pans
      </span>
    </Link>
  );
}
