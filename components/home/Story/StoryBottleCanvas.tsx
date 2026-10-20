"use client";

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { createStoryBottleScene, type CivilizationKey } from "./StoryBottleScene";

type Props = { civilization: CivilizationKey };
type Handle = { setMaterial: (key: CivilizationKey) => void };

export default forwardRef<Handle, Props>(function StoryBottleCanvas({ civilization }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ReturnType<typeof createStoryBottleScene> | null>(null);

  useImperativeHandle(ref, () => ({
    setMaterial: (key: CivilizationKey) => {
      sceneRef.current?.setMaterial(key);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!sceneRef.current) sceneRef.current = createStoryBottleScene(container);
    sceneRef.current.setMaterial(civilization);
  }, [civilization]);

  useEffect(() => {
    return () => sceneRef.current?.dispose();
  }, []);

  return <div ref={containerRef} className="relative w-full h-full" />;
});
