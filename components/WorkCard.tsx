"use client";

import { useRef } from "react";
import type { Work } from "@/data/site";
import { prefersReducedMotion } from "@/lib/motion";
import WorkThumb from "./WorkThumb";

// Где на мокапе (1600×1000) находится экран ноутбука — в процентах,
// чтобы окошко совпадало с экраном при любом размере карточки.
// Значения посчитаны из вёрстки сцены в scripts/mockups.mjs.
const SCREEN = { left: "29.4375%", top: "11.1%", width: "56.375%", height: "56.375%" };
const SCROLL_SPEED = 260; // px в секунду — темп прокрутки длинного скриншота

// Карточка работы:
// · превью наклоняется в 3D за курсором и подсвечивается вишнёвым пятном;
// · при наведении длинный скриншот сайта прокручивается внутри экрана ноутбука.
// Превью собрано из трёх слоёв: мокап → прокручиваемый экран → телефон поверх.
export default function WorkCard({ work }: { work: Work }) {
  const ref = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const longRef = useRef<HTMLImageElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0…1
    const y = (e.clientY - r.top) / r.height; // 0…1
    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }

  // Наведение: сдвигаем скриншот вверх ровно на столько, на сколько он выше окошка
  function onEnter(e: React.PointerEvent) {
    const img = longRef.current;
    const box = screenRef.current;
    if (!img || !box || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const shift = img.offsetHeight - box.offsetHeight;
    if (shift <= 0) return;
    img.style.transitionDuration = `${Math.max(3, shift / SCROLL_SPEED)}s`;
    img.style.transitionTimingFunction = "cubic-bezier(.45,.05,.55,.95)";
    img.style.transform = `translateY(${-shift}px)`;
  }

  // Уход мыши: быстро возвращаемся наверх и выравниваем наклон
  function onLeave() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
    const img = longRef.current;
    if (!img) return;
    img.style.transitionDuration = "0.9s";
    img.style.transitionTimingFunction = "cubic-bezier(.2,.7,.2,1)";
    img.style.transform = "translateY(0)";
  }

  const content = (
    <>
      <div
        ref={ref}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-panel-2 transition-[transform,border-color] duration-300 ease-out group-hover:border-accent"
        style={{ transform: "perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
      >
        {work.image ? (
          <>
            {/* 1. мокап целиком */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={work.image} alt={work.title} className="absolute inset-0 h-full w-full object-cover" />

            {/* 2. окошко точно поверх экрана ноутбука с длинным скриншотом */}
            {work.scroll && (
              <div ref={screenRef} className="absolute overflow-hidden rounded-[2px] bg-black" style={SCREEN}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={longRef}
                  src={work.scroll}
                  alt=""
                  loading="lazy"
                  className="block w-full transition-transform will-change-transform"
                />
                {/* блик на стекле, как на мокапе */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,.09)_0%,rgba(255,255,255,.035)_34%,transparent_34.2%)]" />
              </div>
            )}

            {/* 3. телефон поверх экрана ноутбука */}
            {work.front && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={work.front} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
            )}
          </>
        ) : (
          <WorkThumb thumb={work.thumb} />
        )}

        <div className="absolute left-3 top-3 z-[2] flex gap-1.5">
          {work.tags.map((t) => (
            <span key={t} className="tag !bg-panel !text-bone">
              {t}
            </span>
          ))}
        </div>

        {/* Подсветка, следующая за курсором */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(196,34,74,0.18), transparent 60%)",
          }}
        />
      </div>

      <span className="mono text-ash">{work.kind}</span>
      <h3>{work.title}</h3>
      <p className="text-[15px] text-ash">{work.description}</p>
      {work.link && <span className="font-mono text-xs text-accent">смотреть демо →</span>}
    </>
  );

  const cls = "group flex min-w-0 flex-col gap-3";
  return work.link ? (
    <a href={work.link} target="_blank" rel="noopener" className={cls}>
      {content}
    </a>
  ) : (
    <article className={cls}>{content}</article>
  );
}
