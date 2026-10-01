export const SITE = {
  name: "Pans & Wine",
  byline: "by Only Pans",
  tagline: "We don't just cook, we curate unforgettable memories & high-end luxury experiences.",
  accent: "#a4636a",
  phone: "0790 382766",
  email: "onlypanandwine@gmail.com",
  whatsapp: "https://wa.me/254790382766",
};

// Leave a url empty to hide that network everywhere on the site.
export const SOCIALS = [
  { key: "whatsapp", label: "WhatsApp", handle: SITE.phone, url: SITE.whatsapp },
  { key: "instagram", label: "Instagram", handle: "@onlypans.komz", url: "https://www.instagram.com/onlypans.komz/" },
  { key: "instagram", label: "Instagram", handle: "@pansandwinee", url: "https://www.instagram.com/pansandwinee/" },
  { key: "tiktok", label: "TikTok", handle: "", url: "" },
  { key: "facebook", label: "Facebook", handle: "", url: "" },
  { key: "x", label: "X (Twitter)", handle: "", url: "" },
].filter((s) => s.url);

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export const SHOP_TABS = [
  { key: "tickets", label: "Tickets" },
  { key: "wearables", label: "Wearables" },
  { key: "cookware", label: "Cookware" },
  { key: "ebooks", label: "eBooks & Recipes" },
];

export function imageOf(doc, size = "card") {
  return doc?.photo?.sizes?.[size]?.url || doc?.photo?.url || doc?.imageUrl || null;
}

export function galleryPhotos(docs) {
  return docs.map((d) => ({ id: d.id, src: imageOf(d, "hero"), caption: d.caption || "" })).filter((p) => p.src);
}

// Upcoming, published events. Rows created before isPublished existed have it null, so treat null as published.
export function upcomingEventsWhere() {
  return {
    and: [
      { eventDate: { greater_than_equal: new Date(new Date().setHours(0, 0, 0, 0)).toISOString() } },
      { or: [{ isPublished: { equals: true } }, { isPublished: { exists: false } }] },
    ],
  };
}

// Only what the browser needs; keeps private fields like sellerContact out of the page.
export function publicEvent(e) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    eventDate: e.eventDate,
    venue: e.venue,
    organizer: e.organizer || SITE.name,
    ticketPrice: e.ticketPrice,
    availableTickets: e.availableTickets,
    timeOptions: (e.timeOptions || []).map(({ time, availableTickets }) => ({ time, availableTickets })),
    image: imageOf(e, "card"),
  };
}

// Fixed timezone so server and browser render the same date.
export function formatDate(iso, options) {
  return new Date(iso).toLocaleDateString("en-KE", { timeZone: "Africa/Nairobi", ...options });
}
