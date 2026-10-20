"use client";

import { useEffect, useRef } from "react";
import {
  createNewHeroBottleScene,
  type NewHeroBottleHandle,
} from "./newHeroBottleScene";

export default function NewHeroBottleCanvas({
  onReady,
}: {
  onReady?: (handle: NewHeroBottleHandle | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handle = createNewHeroBottleScene(container);
    onReady?.(handle);
    return () => {
      onReady?.(null);
      handle.dispose();
    };
    // `onReady` is a stable setter from the parent; intentionally not a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
}
