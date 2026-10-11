import { contacts } from "@/data/site";
import Reveal from "./Reveal";
import RevealTitle from "./RevealTitle";
import TelegramLink from "./TelegramLink";
import CopyButton from "./CopyButton";

export default function Contacts() {
  return (
    <section id="contact" className="panel scroll-mt-24">
      <div className="grid items-center gap-[clamp(20px,4vw,56px)] md:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-[18px]">
          <RevealTitle parts={["Есть задача?", { text: "Пишите", className: "text-accent" }]} />
          <Reveal delay={200}>
          <p className="max-w-[40ch] text-ash">
            Расскажите в двух словах, что нужно. Отвечу в течение пары часов и предложу решение.
            Консультация бесплатная.
          </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          {/* Telegram: ссылка (сначала приложение, потом t.me) + кнопка «скопировать» рядом.
              Кнопка стоит вне ссылки: вкладывать кнопку внутрь <a> нельзя */}
          <div className="flex items-center gap-3 border-y border-line py-[18px]">
            <TelegramLink
              username={contacts.telegramUsername}
              className="group flex min-w-0 flex-1 justify-between gap-3 text-lg transition-colors hover:text-accent"
            >
              Telegram
              <span className="whitespace-nowrap font-mono text-[13px] text-ash transition-transform group-hover:translate-x-1">
                {contacts.telegramLabel} →
              </span>
            </TelegramLink>
            <CopyButton text={contacts.telegramLabel} iconOnlyOnMobile />
          </div>
          <a
            href={contacts.kwork}
            target="_blank"
            rel="noopener"
            className="group flex justify-between gap-3 border-b border-line py-[18px] text-lg transition-colors hover:text-accent"
          >
            Kwork
            <span className="font-mono text-[13px] text-ash transition-transform group-hover:translate-x-1">
              {contacts.kworkLabel} →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
