export const BRANDS = {
  onlypans: {
    slug: "onlypans",
    dbKey: "only-pans",
    name: "Only Pans",
    tagline: "West Coast Barbecue",
    accent: "#BC3737",
    accentDark: "#8f2929",
    dark: "#1a1a1a",
    instagram: "https://www.instagram.com/onlypans.komz/",
    switchTo: "panswine",
    switchLabel: "Switch to Wine",
  },
  panswine: {
    slug: "panswine",
    dbKey: "pans-and-wine",
    name: "Pans & Wine",
    tagline: "West Coast Barbecue",
    accent: "#2a6f5c",
    accentDark: "#1d4f3f",
    dark: "#1a1a1a",
    instagram: "https://www.instagram.com/pansandwinee/",
    switchTo: "onlypans",
    switchLabel: "Switch to Pans",
  },
};

export const NAV_LINKS = [
  { href: "catering", label: "Catering" },
  { href: "our-story", label: "Our Story" },
  { href: "shop", label: "Shop" },
  { href: "cookbook", label: "Cookbook" },
  { href: "events", label: "Events" },
  { href: "contact-us", label: "Contact Us" },
];

export function getBrand(slug) {
  return BRANDS[slug] ?? null;
}

export function isValidBrand(slug) {
  return slug in BRANDS;
}
