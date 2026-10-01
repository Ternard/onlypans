import Link from "next/link";
import { payloadClient } from "@/lib/getPayload";
import { galleryPhotos } from "@/lib/site";
import PageHeader from "@/components/PageHeader";
import GalleryGrid from "./GalleryGrid";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const payload = await payloadClient();
  const { docs } = await payload.find({ collection: "gallery", sort: "displayOrder", limit: 200 });
  const photos = galleryPhotos(docs);

  return (
    <>
      <PageHeader eyebrow="Events gallery" title="Moments we've curated">
        Graduation dinners, weddings, private tables and pop-ups — a look inside the experiences we&apos;ve cooked for.
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {photos.length > 0 ? (
          <GalleryGrid photos={photos} />
        ) : (
          <p className="rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center text-ink/55">
            Our first gallery is coming soon — photos from our events will appear here.
          </p>
        )}
        <div className="mt-16 text-center">
          <p className="font-display text-2xl font-semibold">Want your event here next?</p>
          <Link href="/services#book" className="btn btn-dark mt-5">Book Pans &amp; Wine</Link>
        </div>
      </section>
    </>
  );
}
