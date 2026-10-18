export const SITE = {
  company: "Arkvoid Inc.",
  name: "Arkvoid",
  founder: "Manish Talukdar",
  founderTitle: "Founder",
  domain: "https://arkvoid.com",
  email: "heyarkvoid@gmail.com",
  x: { handle: "@ArkvoidAI", url: "https://x.com/ArkvoidAI" },
  year: 2026,
};

export const WAITLIST_ENDPOINT = ""; // empty = open the visitor's email app with a prefilled message
export const SHOW_ROUND_SIZE = false;

export const SECTION_IDS = {
  hero: "top",
  manifesto: "manifesto",
  about: "about",
  world: "world",
  characters: "characters",
  realms: "realms",
  how: "how",
  research: "research",
  hardware: "hardware",
  roadmap: "roadmap",
  whyNow: "why-now",
  investors: "investors",
  founder: "founder",
  faq: "faq",
  join: "join",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
