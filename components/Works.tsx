import { works } from "@/data/site";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import WorkCard from "./WorkCard";

// Сетка как в превью: на десктопе 6 колонок, широкая карточка занимает 3
// (две в ряд), обычная 2 (три в ряд). На планшете 2 колонки, последняя
// карточка растягивается на всю ширину. На телефоне 1 колонка.
export default function Works() {
  return (
    <section id="works" className="panel scroll-mt-24">
      <SectionHead
        title="Работы"
        text="Сайты для студий и мастеров: от идеи и дизайна до запуска и онлайн-записи."
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-6">
        {works.map((w, i) => (
          <Reveal
            key={w.title}
            delay={(i % 3) * 100}
            className={`min-w-0 sm:last:col-span-2 ${w.wide ? "md:col-span-3" : "md:col-span-2"}`}
          >
            <WorkCard work={w} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
