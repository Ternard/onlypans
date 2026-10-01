import { League_Spartan, Jost } from "next/font/google";
import "../globals.css";
import { SITE } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const spartan = League_Spartan({ subsets: ["latin"], variable: "--font-spartan" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

// Content is edited live in the CMS, so always render fresh.
export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: `${SITE.name} ${SITE.byline}`, template: `%s · ${SITE.name}` },
  description: SITE.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spartan.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
