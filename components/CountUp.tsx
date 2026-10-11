"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const DURATION = 1400; // мс

// Числа в тексте «набегают» от нуля, когда элемент попадает в экран.
// Слова не трогаем: «1–2 дня» → «0–0 дня» … «1–2 дня», «демо» остаётся «демо».
// Сервер отдаёт итоговое значение — без JavaScript всё читается как есть.
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const numbers = value.match(/\d+/g);
    if (!el || !numbers || prefersReducedMotion()) return;

    const render = (t: number) => {
      let i = 0;
      el.textContent = value.replace(/\d+/g, () => String(Math.round(Number(numbers[i++]) * t)));
    };
    render(0);

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          render(1 - Math.pow(1 - p, 3)); // easeOutCubic: быстро, потом «докатывается»
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
