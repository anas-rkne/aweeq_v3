"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { menuLinks } from "@/config/site";
import MenuOverlay from "./MenuOverlay";
import { useCart } from "@/components/cart/CartContext";

export default function Navbar() {
  const t = useTranslations("Nav");
  const tMenu = useTranslations("Menu");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { count, openCart } = useCart();

  const otherLocale = locale === "ar" ? "en" : "ar";

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-transparent">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-6 md:h-20 md:px-10">
          <Link href="/" aria-label="3WEEQ" className="shrink-0">
            <Image
              src="/art/hero/logo-11.png"
              alt=""
              width={44}
              height={44}
              loading="eager"
              className="h-14 w-14 object-contain md:h-20 md:w-20"
            />
          </Link>

          <nav
            aria-label={t("primary")}
            className="hidden items-center gap-10 md:flex"
          >
            {menuLinks.map((link) => (
              <MenuLinkItem
                key={link.key}
                href={link.href}
                label={tMenu(link.key)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="#"
              className="hidden text-small text-beige/80 transition-colors duration-300 ease-out-expo hover:text-beige md:inline"
            >
              {t("login")}
            </a>

            <a
              href="#"
              className="hidden rounded-full bg-beige px-5 py-2 text-small font-medium text-navy-ink transition-[color,background-color,transform] duration-press ease-out-expo hover:bg-gold active:scale-[0.97] md:inline-flex"
            >
              {t("signup")}
            </a>

            <button
              type="button"
              onClick={openCart}
              aria-label={t("openCart")}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-beige transition-[color,transform] duration-press ease-out-expo hover:text-gold active:scale-[0.94]"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 7h12l1.2 12.2a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {count > 0 && (
                <span className="pop-in absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-micro font-semibold text-navy-ink">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.replace(pathname, { locale: otherLocale })}
              aria-label={otherLocale === "en" ? t("toEnglish") : t("toArabic")}
              className="rounded-full border border-beige/25 px-4 py-1.5 text-small text-beige transition-colors duration-300 ease-out-expo hover:border-beige"
            >
              {otherLocale === "en" ? "EN" : "عربي"}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center text-beige md:hidden"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 7h18M3 12h18M3 17h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}

function MenuLinkItem({ href, label }: { href: string; label: string }) {
  const className =
    "text-small text-beige/80 transition-colors duration-300 ease-out-expo hover:text-beige";

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
