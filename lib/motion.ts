"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Включено ли в системе «уменьшить движение» — как значение для рендера.
// useSyncExternalStore: на сервере (и при «оживлении» страницы) — false,
// сразу после этого React сам подставляет настоящее значение из браузера
// и следит за изменением настройки на лету.
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

// То же самое, но разово — для обработчиков событий и эффектов
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(QUERY).matches;
