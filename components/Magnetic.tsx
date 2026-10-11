"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Магнитная обёртка: элемент чуть притягивается к курсору.
// strength — какую долю расстояния до курсора проходит кнопка, max — предел в px.
export default function Magnetic({
  children,
  strength = 0.35,
  max = 14,
}: {
  children: React.ReactNode;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const dx = clamp((e.clientX - (r.left + r.width / 2)) * strength);
    const dy = clamp((e.clientY - (r.top + r.height / 2)) * strength);
    el.style.transition = "transform 0.2s ease-out";
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    // возврат с лёгким пружинящим перелётом (1.6 > 1 — кнопка проскакивает центр)
    el.style.transition = "transform 0.6s cubic-bezier(0.3, 1.6, 0.5, 1)";
    el.style.transform = "translate(0, 0)";
  }

  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="magnetic inline-block will-change-transform">
      {children}
    </span>
  );
}
