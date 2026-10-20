"use client"; // هذا السطر إلزامي

import dynamic from "next/dynamic";

const NewHero3D = dynamic(() => import("@/components/home/Hero/NewHero3D"), {
  ssr: false,
});

export default function HeroWrapper() {
  return <NewHero3D />;
}