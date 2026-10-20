"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { menuLinks } from "@/config/site";
import { useLenis } from "@/providers/SmoothScroll";

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const t = useTranslations("Nav");
  const tMenu = useTranslations("Menu");
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (open) {
      lenis?.stop();
      if (!lenis) {
        document.body.style.overflow = "hidden";
      }
      const firstFocusable =
        panelRef.current?.querySelector<HTMLElement>("a[href], button");
      firstFocusable?.focus();
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) {
      return;
    }

    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])"
      )
    );
    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("siteMenu")}
      inert={!open}
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 z-50 flex flex-col bg-navy-ink transition-opacity duration-300 ease-out-expo ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-6 md:h-20 md:px-10">
        <Image
          src="/art/hero/logo-11.png"
          alt=""
          width={44}
          height={44}
          className="h-9 w-9 object-contain md:h-11 md:w-11"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeMenu")}
          className="flex h-11 w-11 items-center justify-center text-beige transition-transform duration-press ease-out-expo active:scale-[0.92]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav
        aria-label={t("primary")}
        className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-24"
      >
        {menuLinks.map((link, i) => {
          const className = `font-primary text-3xl text-beige transition-[color,opacity,transform] duration-interaction ease-out-expo hover:text-gold md:text-4xl ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`;

          if (link.href.startsWith("#")) {
            return (
              <a
                key={link.key}
                href={link.href}
                onClick={onClose}
                className={className}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              >
                {tMenu(link.key)}
              </a>
            );
          }

          return (
            <Link
              key={link.key}
              href={link.href}
              onClick={onClose}
              className={className}
              style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
            >
              {tMenu(link.key)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
