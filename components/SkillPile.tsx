"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

// Раскладка «кучи» задана вручную для каждой плашки по порядку:
// x — центр плашки по горизонтали, % ширины контейнера;
// y — отступ сверху, px; r — угол поворота, градусы;
// xm / ym — то же для телефона (< 600px); cut — у плашки срезан один угол.
type Spot = { x: number; y: number; r: number; xm: number; ym: number; cut?: string };
const SPOTS: Spot[] = [
  { x: 30, y: 30, r: -9, xm: 26, ym: 14 },                                  // next.js
  { x: 66, y: 20, r: 8, xm: 70, ym: 6, cut: "999px 999px 8px 999px" },      // react
  { x: 56, y: 86, r: -3, xm: 60, ym: 62 },                                  // typescript
  { x: 25, y: 128, r: 11, xm: 22, ym: 100 },                                // tailwind
  { x: 70, y: 150, r: -11, xm: 72, ym: 120, cut: "999px 999px 999px 8px" }, // supabase
  { x: 35, y: 194, r: -5, xm: 33, ym: 156 },                                // python
  { x: 57, y: 236, r: 4, xm: 57, ym: 196 },                                 // telegram bot api
];

// Приглушённые серо-розовые круги, частично выглядывают из-под плашек
const DOTS = [
  { x: 11, y: 76, ym: 58, s: 46 },
  { x: 86, y: 94, ym: 74, s: 40 },
  { x: 50, y: 146, ym: 112, s: 50 },
  { x: 84, y: 238, ym: 186, s: 42 },
];

// Навыки «кучей», как стикеры: плашки повёрнуты, слегка перекрываются,
// при появлении секции падают сверху по очереди с отскоком.
export default function SkillPile({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion(); // «уменьшить движение» — плашки сразу на местах

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} className={`skill-pile ${inView || reduced ? "is-in" : ""}`}>
      {DOTS.map((d, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="skill-dot"
          style={{ left: `${d.x}%`, "--y": `${d.y}px`, "--ym": `${d.ym}px`, width: d.s, height: d.s } as React.CSSProperties}
        />
      ))}
      <ul className="contents">
        {items.map((t, i) => {
          const s = SPOTS[i % SPOTS.length];
          return (
            <li
              key={t}
              className={`skill-tag ${i % 2 === 0 ? "skill-tag--fill" : "skill-tag--line"}`}
              style={
                {
                  "--x": `${s.x}%`,
                  "--y": `${s.y}px`,
                  "--xm": `${s.xm}%`,
                  "--ym": `${s.ym}px`,
                  "--r": `${s.r}deg`,
                  "--d": `${i * 110}ms`, // задержка: плашки падают по очереди
                  borderRadius: s.cut ?? "999px",
                } as React.CSSProperties
              }
            >
              {t}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
