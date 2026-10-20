"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis smooth scroll for the whole app.
 *
 * `prefers-reduced-motion: reduce` means Lenis is never created at all —
 * native scrolling stays untouched and every consumer falls back to instant
 * behaviour (BackToTop jumps instead of gliding, the menu overlay locks via
 * body overflow instead of lenis.stop()).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const instance = new Lenis({ lerp: 0.12, anchors: true });

    // One clock for both: ScrollTrigger reads Lenis' smoothed position and
    // Lenis advances on GSAP's ticker, so scrubbed timelines never trail the
    // scroll by a frame.
    const onScroll = () => ScrollTrigger.update();
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      instance.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
