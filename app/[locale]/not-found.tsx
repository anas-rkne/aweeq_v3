import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <p className="font-secondary text-small tracking-[0.4em] text-gold">
        404
      </p>
      <h1 className="font-primary text-h2 text-beige">{t("title")}</h1>
      <p className="max-w-md text-body text-beige/70">{t("description")}</p>
      <Link
        href="/"
        className="mt-2 rounded-full border border-beige/30 px-8 py-3 text-small text-beige transition-colors duration-300 ease-out-expo hover:border-gold hover:bg-gold hover:text-navy-ink"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
