/**
 * The Seal line — the one sentence the client loved, turned into a quiet
 * runway (Palmo §scene 6): an infinite horizontal marquee of «كل دفعة تحمل رقمها
 * الخاص». Pure CSS transform (`seal-run` keyframes in globals.css), killed
 * under reduced-motion by the global rule.
 */
export default function SealMarquee() {
  const phrase = "كل دفعة تحمل رقمها الخاص";
  const items = Array.from({ length: 6 });

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-beige/10 bg-navy-deep py-5"
    >
      <div className="flex w-max animate-[seal-run_28s_linear_infinite] items-center gap-10 pl-10">
        {items.map((_, i) => (
          <span key={i} className="flex items-center gap-10">
            <span dir="rtl" className="whitespace-nowrap font-primary text-h3 text-beige/90">
              {phrase}
            </span>
            <span className="h-2 w-2 rotate-45 bg-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
