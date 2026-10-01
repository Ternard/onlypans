import Link from "next/link";
import ClearCartOnLoad from "./ClearCartOnLoad";
import MpesaStatus from "./MpesaStatus";

export const metadata = { title: "Thank you" };

export default async function OrderConfirmationPage({ searchParams }) {
  const { order, booking, pay } = await searchParams;
  const reference = order || booking;
  const mpesa = pay === "mpesa" && reference;

  return (
    <section className="gingham px-4 py-20 sm:py-28">
      {order && <ClearCartOnLoad />}
      <div className="mx-auto max-w-xl rounded-sm bg-cream px-6 py-14 text-center shadow-2xl shadow-black/20 sm:px-12">
        <p className="eyebrow">{mpesa ? "M-Pesa payment" : booking ? "Tickets confirmed" : "Order confirmed"}</p>
        <h1 className="mt-4 text-5xl font-bold text-rose-deep">Thank you!</h1>
        {mpesa ? (
          <>
            <p className="mt-4 leading-relaxed text-ink/65">Your {booking ? "booking" : "order"} {reference}.</p>
            <MpesaStatus kind={booking ? "booking" : "order"} reference={reference} />
          </>
        ) : (
          <p className="mt-4 leading-relaxed text-ink/65">
            {reference ? `Your ${booking ? "booking" : "order"} ${reference} is confirmed.` : "You're confirmed."}{" "}
            We&apos;ll be in touch shortly with {booking ? "event" : "delivery"} details.
          </p>
        )}
        <Link href="/shop" className="btn btn-dark mt-8">Continue Shopping</Link>
      </div>
    </section>
  );
}
