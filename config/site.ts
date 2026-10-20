/**
 * Single source of truth for site chrome: navigation and contact details.
 *
 * Rules encoded here (MASTER-PLAN §5):
 * - Links point only at destinations that exist. `store` joins `menuLinks`
 *   when the store ships (phase 5) — until then it must not be rendered.
 * - Contact fields stay empty until the client supplies real data; layouts
 *   render a field only when it has a value (no placeholder contact info).
 */

export type MenuLinkKey = "story" | "collection" | "store";

export type MenuLink = {
  key: MenuLinkKey;
  href: string;
};

export const menuLinks: MenuLink[] = [
  { key: "story", href: "#story" },
  { key: "collection", href: "#collection" },
];

export const siteContact = {
  email: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  linkedin: "",
};
