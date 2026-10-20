/**
 * `/` is redirected to the detected locale by `proxy.ts` (next-intl
 * middleware, 307 → `/ar`), so this route is NEVER rendered for users.
 * `force-dynamic` opts it out of build-time prerendering: without a locale
 * provider, `useLocale()` in shared client components would throw during
 * static generation.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  return null;
}
