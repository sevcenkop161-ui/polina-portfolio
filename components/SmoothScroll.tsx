"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { prefersReducedMotion } from "@/lib/motion";

// Плавная прокрутка колёсиком. На телефонах Lenis сам не вмешивается
// (там нативная прокрутка и так плавная).
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,        // сколько длится «докат» после прокрутки, секунд
      anchors: true,        // ссылки #works и т.д. тоже плавные; отступ под шапку берётся из scroll-mt-24 у секций
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
