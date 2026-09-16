"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTOPLAY_MS = 5000;

export default function HeroCarousel({ images, accent, dark, children }) {
  const [index, setIndex] = useState(0);
  const dragStartX = useRef(null);
  const timerRef = useRef(null);
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [count, index]);

  function restartAutoplay() {
    clearInterval(timerRef.current);
    if (count > 1) {
      timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    }
  }

  function goTo(next) {
    setIndex(((next % count) + count) % count);
    restartAutoplay();
  }

  function onPointerDown(e) {
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX;
  }

  function onPointerUp(e) {
    if (dragStartX.current == null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? dragStartX.current;
    const delta = endX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goTo(index + 1);
    else goTo(index - 1);
  }

  return (
    <div
      className="relative isolate flex min-h-[80vh] flex-col items-start justify-center overflow-hidden text-white sm:min-h-[85vh]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchEnd={onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      {images.map((img, i) => {
        const isNear = Math.abs(i - index) <= 1 || (i === 0 && index === count - 1) || (i === count - 1 && index === 0);
        return (
          <div
            key={img.id ?? i}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "scale(1.06)" : "scale(1)",
              transition: "opacity 1400ms ease-in-out, transform 9000ms ease-out",
            }}
          >
            {isNear && (
              <Image
                src={img.imageUrl}
                alt=""
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        );
      })}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${dark}cc 0%, ${dark}66 40%, ${dark}f2 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 15% 20%, ${accent}55, transparent 55%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-start gap-4 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {children}
      </div>

      {count > 1 && (
        <div className="relative z-10 flex gap-2 px-4 pb-6 sm:px-6 lg:px-8">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 28 : 10,
                backgroundColor: i === index ? accent : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
