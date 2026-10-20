"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Luxury footer — strict 4-column CSS Grid, RTL, right-aligned within columns.
 * Copy is localized via the `Footer` namespace.
 */
export default function Footer() {
  const t = useTranslations("Footer");

  const quickLinks = [
    { href: "/", label: t("quick.home") },
    { href: "/store", label: t("quick.collection") },
    { href: "/about", label: t("quick.craft") },
    { href: "/#contact", label: t("quick.contact") },
  ];

  const customerLinks = [
    { href: "/store", label: t("customer.shipping") },
    { href: "/store", label: t("customer.returns") },
    { href: "/store", label: t("customer.privacy") },
  ];

  return (
    <footer
      dir="rtl"
      className="relative w-full overflow-hidden border-t border-[#cd9e61]/30 bg-[#0a1128]"
    >
      {/* Wall background */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src="/images/new_hero/wall.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0a1128]/88" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-8 pb-12 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8 lg:gap-12">
          {/* Column 1 (Far Right): Logo & Tagline */}
          <div className="flex flex-col items-start text-right">
            <Image
              src="/art/hero/logo-11.png"
              alt="3WEEQ"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <p className="mt-4 max-w-[14rem] font-secondary text-sm leading-relaxed text-beige/90">
              {t("brandTagline")}
            </p>
          </div>

          {/* Column 2 (Middle Right): Quick Links */}
          <div className="flex flex-col items-end text-right">
            <h3 className="mb-4 font-primary text-base font-semibold text-[#cd9e61]">
              {t("quick.title")}
            </h3>
            <ul className="flex flex-col items-end gap-3">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-beige/80 transition-colors duration-300 hover:text-[#cd9e61]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 (Middle Left): Customer Service */}
          <div className="flex flex-col items-end text-right">
            <h3 className="mb-4 font-primary text-base font-semibold text-[#cd9e61]">
              {t("customer.title")}
            </h3>
            <ul className="flex flex-col items-end gap-3">
              {customerLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-beige/80 transition-colors duration-300 hover:text-[#cd9e61]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 (Far Left): Newsletter */}
          <div className="flex flex-col items-start text-right">
            <h3 className="mb-2 font-primary text-base font-semibold text-[#cd9e61]">
              {t("newsletter.title")}
            </h3>
            <p className="mb-5 text-xs text-beige/70">
              {t("newsletter.subtitle")}
            </p>
            <form
              className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:gap-0 sm:overflow-hidden sm:border sm:border-[#cd9e61]"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="min-w-0 flex-1 border border-[#cd9e61] bg-transparent px-3 py-2.5 text-right text-sm text-beige placeholder:text-beige/40 focus:outline-none sm:border-0"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#cd9e61] px-5 py-2.5 text-sm font-medium text-[#081127] transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-beige active:scale-[0.97]"
              >
                {t("newsletter.button")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#cd9e61]/30 pt-6 md:flex-row">
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-[#cd9e61] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-80 active:scale-[0.92]"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="text-[#cd9e61] transition-[opacity,transform] duration-press ease-out-expo hover:opacity-80 active:scale-[0.92]"
            >
              <TikTokIcon />
            </a>
          </div>
          <p className="text-xs text-beige/60">{t("copyrightText")}</p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <line
        x1="17.5"
        y1="6.5"
        x2="17.51"
        y2="6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
