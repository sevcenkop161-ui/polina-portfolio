import { contacts } from "@/data/site";
import TelegramLink from "./TelegramLink";
import CopyButton from "./CopyButton";

const links = [
  { href: "#about", label: "обо мне" },
  { href: "#works", label: "работы" },
  { href: "#services", label: "услуги" },
  { href: "#process", label: "этапы" },
  { href: "#contact", label: "контакты" },
];

export default function Nav() {
  return (
    <nav
      aria-label="Навигация"
      className="sticky top-2 z-40 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-line bg-panel/70 px-4 py-0.5 backdrop-blur-md sm:px-5 sm:py-2.5"
    >
      {/* Логотип: две вишнёвые точки одна над другой */}
      <a href="#top" aria-label="Наверх" className="flex h-4 w-3 flex-col justify-between">
        <span className="h-[7px] w-3 rounded-full bg-accent-2" />
        <span className="h-[7px] w-3 rounded-full bg-accent-2" />
      </a>

      <ul className="mono flex flex-wrap gap-3 sm:gap-[clamp(12px,2.5vw,28px)]">
        {links.map((l) => (
          <li key={l.href}>
            {/* на телефоне — вертикальный отступ: зона нажатия не меньше 40px */}
            <a href={l.href} className="inline-block py-[11px] text-ash transition-colors hover:text-bone sm:py-0">
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="mono hidden items-center gap-[18px] sm:flex">
        <a href={contacts.kwork} target="_blank" rel="noopener" className="text-ash transition-colors hover:text-bone">
          kwork
        </a>
        <span className="flex items-center gap-1">
          <TelegramLink username={contacts.telegramUsername} className="text-ash transition-colors hover:text-bone">
            tg
          </TelegramLink>
          <CopyButton text={contacts.telegramLabel} compact tip="bottom" />
        </span>
      </div>
    </nav>
  );
}
