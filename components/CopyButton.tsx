"use client";

import { useRef, useState } from "react";
import { copyText } from "@/lib/telegram";

// Маленькая кнопка «скопировать» с подсказкой «скопировано».
// compact — только иконка (для шапки), iconOnlyOnMobile — на узких экранах только иконка,
// tip — где показать подсказку.
export default function CopyButton({
  text,
  compact = false,
  iconOnlyOnMobile = false,
  tip = "top",
  className = "",
}: {
  text: string;
  compact?: boolean;
  iconOnlyOnMobile?: boolean;
  tip?: "top" | "bottom";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  async function onClick() {
    if (!(await copyText(text))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  const tipPlace = tip === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const tipHidden = tip === "top" ? "translate-y-1 opacity-0" : "-translate-y-1 opacity-0";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Скопировать ${text}`}
      title={`Скопировать ${text}`}
      className={`copy-btn relative inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-ash transition-colors hover:text-bone ${
        compact ? "p-1" : "rounded-full border border-line px-2.5 py-1 hover:border-accent"
      } ${iconOnlyOnMobile ? "max-sm:min-h-11 max-sm:min-w-11 max-sm:justify-center" : ""} ${className}`}
    >
      {/* иконка «два листа» */}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
      {!compact && <span className={iconOnlyOnMobile ? "hidden sm:inline" : ""}>скопировать</span>}

      {/* подсказка; role="status" — экранная читалка тоже скажет «скопировано» */}
      <span
        role="status"
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-accent px-2 py-1 font-mono text-[11px] text-white transition-all duration-200 ${tipPlace} ${
          copied ? "translate-y-0 opacity-100" : tipHidden
        }`}
      >
        {copied ? "скопировано" : ""}
      </span>
    </button>
  );
}
