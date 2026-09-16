import { notFound } from "next/navigation";
import { getBrand, isValidBrand } from "@/lib/brands";
import { CartProvider } from "@/lib/cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return [{ brand: "onlypans" }, { brand: "panswine" }];
}

export default async function BrandLayout({ children, params }) {
  const { brand: brandSlug } = await params;
  if (!isValidBrand(brandSlug)) notFound();
  const brand = getBrand(brandSlug);

  return (
    <CartProvider brandSlug={brand.slug}>
      <div className="flex min-h-full flex-col" style={{ "--accent": brand.accent }}>
        <Nav brand={brand} />
        <main className="flex-1">{children}</main>
        <Footer brand={brand} />
      </div>
    </CartProvider>
  );
}
