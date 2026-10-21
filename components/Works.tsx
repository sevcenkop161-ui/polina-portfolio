import { works } from "@/data/site";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import WorkCard from "./WorkCard";

// Сетка 2×2: на планшете и десктопе две карточки в ряд, на телефоне одна колонка.
export default function Works() {
  return (
    <section id="works" className="panel scroll-mt-24">
      <SectionHead
        title="Работы"
        text="Сайты для мастеров и малого бизнеса: от идеи и дизайна до запуска."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {works.map((w, i) => (
          <Reveal
            key={w.title}
            delay={(i % 2) * 100}
            className="min-w-0"
          >
            <WorkCard work={w} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
