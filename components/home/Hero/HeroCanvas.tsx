"use client";

import { useEffect, useRef } from "react";
import {
  createHeroBottleScene,
  type HeroBottleHandle,
} from "./heroBottleScene";

type HeroCanvasProps = {
  onReady: () => void;
  onFail: () => void;
};

/**
 * Mount point for the hero's WebGL bottle. Loaded via `next/dynamic` with
 * `ssr: false` from `HeroSection`, so three.js never enters the initial
 * bundle — the poster and the copy paint first, the glass fades in over them.
 * Purely decorative + pointer-interactive; touch keeps scrolling the page.
 */
export default function HeroCanvas({ onReady, onFail }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const onFailRef = useRef(onFail);

  useEffect(() => {
    onReadyRef.current = onReady;
    onFailRef.current = onFail;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let handle: HeroBottleHandle | null = null;
    try {
      handle = createHeroBottleScene(container, {
        onReady: () => onReadyRef.current(),
        onFail: () => onFailRef.current(),
      });
    } catch (err) {
      console.error("[hero-bottle] init failed", err);
      onFailRef.current();
    }
    return () => {
      handle?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      aria-hidden="true"
      data-hero-bottle="1"
    />
  );
}
