"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Бегущая строка, которая реагирует на скролл:
// · листаешь быстрее — строка ускоряется;
// · листаешь вверх — едет в обратную сторону.
// Контент повторён дважды: когда трек сдвигается на половину,
// позиция незаметно «перескакивает» обратно — шва не видно.
const words = ["сайты", "боты", "дашборды"];
const BASE_SPEED = 80; // px в секунду, когда страница стоит
const MAX_BOOST = 6;   // во сколько раз максимум ускоряется при быстром скролле

export default function Marquee() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const row = Array.from({ length: 4 }, () => words).flat();

  useEffect(() => {
    const el = track.current;
    const box = wrap.current;
    if (!el || !box || prefersReducedMotion()) return;

    let pos = 0;              // текущий сдвиг трека, px
    let dir = 1;              // 1 — едем влево (скролл вниз), −1 — вправо (скролл вверх)
    let velocity = 0;         // сглаженная скорость скролла, px за кадр
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let frame = 0;
    let visible = true;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // секунды с прошлого кадра
      lastTime = now;

      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (dy > 0.5) dir = 1;
      else if (dy < -0.5) dir = -1;
      velocity += (Math.abs(dy) - velocity) * 0.1; // сглаживание

      const boost = Math.min(velocity * 0.3, MAX_BOOST);
      const half = el.scrollWidth / 2;
      pos -= dir * BASE_SPEED * (1 + boost) * dt;
      if (pos <= -half) pos += half;
      if (pos > 0) pos -= half;
      el.style.transform = `translate3d(${pos}px, 0, 0)`;

      if (visible) frame = requestAnimationFrame(tick);
    };

    // строка не видна — не считаем зря
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        lastTime = performance.now();
        lastY = window.scrollY;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(tick);
      }
    });
    io.observe(box);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} className="-my-1 select-none overflow-hidden py-2" aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={i} className="flex items-center font-display text-[clamp(26px,4vw,44px)] uppercase leading-none">
                <span className={i % 2 ? "text-transparent [-webkit-text-stroke:1px_var(--color-ash)]" : "text-bone"}>{w}</span>
                <span className="mx-[clamp(16px,2.5vw,32px)] text-accent">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
