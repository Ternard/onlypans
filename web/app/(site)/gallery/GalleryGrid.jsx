"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function GalleryGrid({ photos }) {
  const dialogRef = useRef(null);
  const [index, setIndex] = useState(0);
  const current = photos[index];

  function open(i) {
    setIndex(i);
    dialogRef.current.showModal();
  }

  function step(delta) {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => open(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl sm:mb-4"
            aria-label={p.caption ? `Open photo: ${p.caption}` : `Open photo ${i + 1}`}
          >
            <Image
              src={p.src}
              alt={p.caption}
              width={800}
              height={i % 3 === 0 ? 1000 : 640}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {p.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/90 to-transparent p-4 pt-10 text-left text-sm font-medium text-cream opacity-0 transition group-hover:opacity-100">
                {p.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-[92vh] w-[min(1100px,94vw)] bg-transparent p-0 backdrop:bg-espresso/90"
      >
        {current && (
          <figure className="relative">
            <Image src={current.src} alt={current.caption} width={1600} height={1100} sizes="94vw" className="max-h-[82vh] w-full rounded-lg object-contain" />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-cream">
              <span className="text-sm">{current.caption}</span>
              <span className="flex gap-2">
                <button type="button" onClick={() => step(-1)} className="btn btn-ghost px-4 py-2" aria-label="Previous photo">←</button>
                <button type="button" onClick={() => step(1)} className="btn btn-ghost px-4 py-2" aria-label="Next photo">→</button>
                <button type="button" onClick={() => dialogRef.current.close()} className="btn btn-primary px-4 py-2">Close</button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
