"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import Reveal from "./Reveal";

type Step = { title: string; text: string };

// Вертикальные разделители между шагами зависят от ширины экрана:
// 4 в ряд — линия перед 2, 3 и 4 шагом; 2 в ряд — только перед 2 и 4;
// на телефоне шаги идут столбиком с линией снизу.
const divider = ["", "sm:border-l sm:pl-5", "md:border-l md:pl-5", "sm:border-l sm:pl-5"];

// Этапы: линия сверху заполняется вишнёвым по мере прокрутки,
// номера шагов загораются по очереди, когда линия доходит до их середины.
export default function ProcessSteps({ steps }: { steps: Step[] }) {
  const box = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0); // сколько шагов уже горит
  const reduced = useReducedMotion(); // «уменьшить движение» — линия заполнена, все номера горят
  const shownLit = reduced ? steps.length : lit;

  useEffect(() => {
    const el = box.current;
    const line = fill.current;
    if (!el || !line) return;
    if (reduced) {
      line.style.transform = "scaleX(1)";
      return;
    }

    let frame = 0;
    const update = () => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight;
      // 0 — верх блока на 85% высоты экрана, 1 — на 25%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.6)));
      line.style.transform = `scaleX(${p})`;
      // шаг i загорается, когда линия дошла до его середины
      setLit(Math.floor(p * steps.length + 0.5)); // React не перерисует, если число не изменилось
      frame = requestAnimationFrame(update);
    };

    // считаем только пока блок на экране
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(update);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [steps.length, reduced]);

  return (
    <div ref={box} className="relative grid sm:grid-cols-2 md:grid-cols-4">
      {/* серая линия и вишнёвая поверх неё, растягивается слева направо */}
      <div className="absolute inset-x-0 top-0 h-px bg-line" />
      <div
        ref={fill}
        className="absolute inset-x-0 top-0 h-px origin-left bg-accent shadow-[0_0_10px_#c4224a]"
        style={{ transform: "scaleX(0)" }}
      />
      {steps.map((s, i) => (
        <Reveal
          key={s.title}
          delay={i * 100}
          className={`flex min-w-0 flex-col gap-2.5 border-b border-line pb-[18px] pt-[22px] sm:border-b-0 sm:pb-1 sm:pr-5 ${divider[i % 4]}`}
        >
          <span
            className={`font-mono text-[13px] transition-[color,text-shadow] duration-500 ${
              i < shownLit ? "text-accent [text-shadow:0_0_12px_#c4224a]" : "text-ash"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{s.title}</h3>
          <p className="text-[15px] text-ash">{s.text}</p>
        </Reveal>
      ))}
    </div>
  );
}
