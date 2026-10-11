"use client";

// Открыть Telegram так, чтобы работало и там, где сайт t.me заблокирован:
// 1) сначала пробуем приложение через tg://resolve?domain=...
// 2) если за 1,5 с приложение не открылось — открываем https://t.me/... как запасной вариант.
// Как понять, что приложение открылось: вкладка теряет фокус или скрывается
// (браузер передал управление приложению).
const FALLBACK_DELAY = 1500;

export const telegramAppUrl = (username: string) => `tg://resolve?domain=${username}`;
export const telegramWebUrl = (username: string) => `https://t.me/${username}`;

export function openTelegram(e: React.MouseEvent<HTMLAnchorElement>, username: string) {
  // Ctrl/Cmd/Shift-клик и средняя кнопка — пусть браузер сделает своё (новая вкладка и т.п.)
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();

  let appOpened = false;
  const markOpened = () => {
    appOpened = true;
  };
  const onVisibility = () => {
    if (document.hidden) markOpened();
  };
  window.addEventListener("blur", markOpened);
  document.addEventListener("visibilitychange", onVisibility);
  const cleanup = () => {
    window.removeEventListener("blur", markOpened);
    document.removeEventListener("visibilitychange", onVisibility);
  };

  // пробуем приложение
  window.location.href = telegramAppUrl(username);

  // запасной вариант — сайт t.me
  window.setTimeout(() => {
    cleanup();
    if (appOpened || document.hidden) return;
    const web = telegramWebUrl(username);
    // в новой вкладке; если браузер заблокировал всплывающее окно — в текущей
    const win = window.open(web, "_blank", "noopener");
    if (!win) window.location.href = web;
  }, FALLBACK_DELAY);
}

// Скопировать текст в буфер обмена.
// navigator.clipboard работает только на https и localhost, поэтому есть запасной способ.
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}
