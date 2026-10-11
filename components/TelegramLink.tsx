"use client";

import { openTelegram, telegramWebUrl } from "@/lib/telegram";

// Ссылка на Telegram: при клике сначала пробует приложение, потом сайт t.me.
// В href остаётся обычная https-ссылка — для правого клика «копировать адрес»,
// Ctrl-клика и браузеров без JavaScript.
export default function TelegramLink({
  username,
  className,
  children,
}: {
  username: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={telegramWebUrl(username)}
      target="_blank"
      rel="noopener"
      onClick={(e) => openTelegram(e, username)}
      className={className}
    >
      {children}
    </a>
  );
}
