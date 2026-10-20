"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/providers/SmoothScroll";

export default function BackToTop() {
  const t = useTranslations("Footer");
  const lenis = useLenis();

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-micro text-beige/70 transition-colors duration-300 ease-out-expo hover:text-beige"
    >
      {t("backToTop")}
    </button>
  );
}
