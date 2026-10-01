import CartView from "./CartView";

export const metadata = { title: "Your Cart" };

export default function CartPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="eyebrow">Shop</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Your cart</h1>
      <CartView />
    </section>
  );
}
