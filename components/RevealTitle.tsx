"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";

// Часть заголовка: просто текст или текст с классом (например, акцентный цвет)
type Part = string | { text: string; className?: string };

type Props = {
  parts: Part[];
  as?: "h1" | "h2";
  className?: string;
  immediate?: boolean; // true — анимация сразу при загрузке (для hero)
};

// Заголовок, который появляется построчно: каждая строка выезжает снизу из-под маски.
// Строки зависят от ширины экрана, поэтому мы их измеряем в браузере:
// слова с одинаковым offsetTop стоят в одной строке.
export default function RevealTitle({ parts, as = "h2", className = "", immediate = false }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion(); // «уменьшить движение» — сразу обычный текст без анимации

  // Разбиваем все части на слова, запоминая класс каждого слова
  const words = useMemo(
    () =>
      parts.flatMap((p) => {
        const { text, className: cls } = typeof p === "string" ? { text: p, className: "" } : p;
        return text.split(/\s+/).filter(Boolean).map((w) => ({ w, cls: cls ?? "" }));
      }),
    [parts],
  );

  const [lines, setLines] = useState<number[][] | null>(null); // индексы слов по строкам
  const [ready, setReady] = useState(false); // строки измерены — можно показывать
  const [inView, setInView] = useState(false); // пора анимировать
  const [done, setDone] = useState(false); // анимация закончилась — снова обычный текст

  // 1. Измеряем строки (после загрузки шрифтов)
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let cancelled = false;
    const measure = () => {
      const spans = [...el.querySelectorAll<HTMLElement>("[data-w]")];
      const groups: number[][] = [];
      let lastTop = -Infinity;
      spans.forEach((s, i) => {
        const top = s.offsetTop;
        if (Math.abs(top - lastTop) > 4) groups.push([]);
        groups[groups.length - 1].push(i);
        lastTop = top;
      });
      if (!cancelled) {
        setLines(groups);
        setReady(true);
      }
    };
    document.fonts.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  // 2. Ждём, пока заголовок попадёт в экран (или стартуем сразу в hero)
  useEffect(() => {
    if (!ready || done || reduced) return;
    const el = ref.current;
    if (!el) return;
    if (immediate) {
      const t = setTimeout(() => setInView(true), 150);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready, done, immediate, reduced]);

  // 3. После анимации возвращаемся к обычному тексту (переносы снова живые)
  useEffect(() => {
    if (!inView || !lines) return;
    const total = 900 + lines.length * 110 + 100;
    const t = setTimeout(() => {
      setLines(null);
      setDone(true);
    }, total);
    return () => clearTimeout(t);
  }, [inView, lines]);

  const word = (i: number, withSpace: boolean) => (
    <span key={i}>
      {withSpace && " "}
      <span data-w="" className={words[i].cls}>
        {words[i].w}
      </span>
    </span>
  );

  const content =
    lines && !done && !reduced
      ? lines.map((line, li) => (
          <span key={li}>
            {li > 0 && " " /* пробел между строками — чтобы экранные читалки не склеивали слова */}
            <span className="split-line">
              <span className="split-inner" style={{ transitionDelay: `${li * 110}ms` }}>
                {line.map((i, k) => word(i, k > 0))}
              </span>
            </span>
          </span>
        ))
      : words.map((_, i) => word(i, i > 0));

  const cls = ["split-title", className, (ready || reduced) && "split-ready", inView && "is-in"].filter(Boolean).join(" ");
  const Tag = as; // h1 или h2
  return (
    <Tag ref={ref} className={cls}>
      {content}
    </Tag>
  );
}
