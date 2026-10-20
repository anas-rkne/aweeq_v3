import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CheckoutForm from "@/components/store/CheckoutForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Store.checkout" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-navy-ink">
      <CheckoutForm />
    </main>
  );
}
