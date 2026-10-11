"use client";

import { useRef } from "react";

// Карточка с мягким вишнёвым свечением, которое следует за курсором.
// Координаты мыши пишем в CSS-переменные --mx/--my — React не перерисовывается,
// градиент двигает сам браузер.
export default function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={onMove} className={`glow-card group/glow relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background: "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(196,34,74,0.22), transparent 70%)",
        }}
      />
      {/* контент над свечением */}
      <div className="relative flex h-full flex-col gap-3">{children}</div>
    </div>
  );
}
