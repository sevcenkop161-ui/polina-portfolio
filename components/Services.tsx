import { services } from "@/data/site";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import GlowCard from "./GlowCard";

export default function Services() {
  return (
    <section id="services" className="panel scroll-mt-24">
      <SectionHead
        title="Услуги и стоимость"
        text="Точная цена и срок зависят от задачи. Напишите, что нужно сделать, и я назову сумму до начала работы."
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 80} className={`min-w-0 ${i === 0 ? "md:col-span-2" : ""}`}>
            <GlowCard className="h-full rounded-xl border border-line bg-panel-2 p-[22px] transition-colors hover:border-accent/60">
              <h3>{s.title}</h3>
              <p className="flex-1 text-[15px] text-ash">{s.description}</p>
              <div className="flex items-baseline justify-between gap-2.5 border-t border-dashed border-line pt-3.5">
                <span className="text-[13px] text-ash">{s.term}</span>
                <b className="whitespace-nowrap font-mono text-[17px] font-medium text-accent tabular-nums">{s.price}</b>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
      <p className="mono mt-5 text-sm text-ash">не нашли свою задачу? напишите, разберёмся вместе</p>
    </section>
  );
}
