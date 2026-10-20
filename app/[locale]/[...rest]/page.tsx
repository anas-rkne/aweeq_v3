import { notFound } from "next/navigation";

/**
 * Catch-all for every unknown path inside a locale (`/ar/…`, `/en/…`).
 *
 * Unmatched URLs never reach `[locale]/not-found.tsx` on their own — Next
 * falls back to its built-in global 404 which sits OUTSIDE the locale layout
 * (no navbar, no footer, no fonts). Routing unknown paths through this
 * catch-all makes `notFound()` throw inside the `[locale]` segment, so the
 * localized 404 renders WITH the full site chrome.
 */
export default function CatchAllPage() {
  notFound();
}
