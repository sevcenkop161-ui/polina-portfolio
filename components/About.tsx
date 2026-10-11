import { facts, stack } from "@/data/site";
import Reveal from "./Reveal";
import RevealTitle from "./RevealTitle";
import CountUp from "./CountUp";
import SkillPile from "./SkillPile";

export default function About() {
  return (
    <section id="about" className="panel scroll-mt-24 overflow-hidden">
      <div className="grid gap-[clamp(20px,4vw,56px)] md:grid-cols-[1fr_1.2fr]">
        <div>
          <RevealTitle parts={["Обо мне"]} />
          <SkillPile items={stack} />
        </div>

        <Reveal delay={120} className="flex flex-col gap-6">
          <p className="max-w-[30ch] text-[clamp(20px,2.4vw,28px)] leading-[1.35]">
            В каждом проекте отвечаю за главное:{" "}
            <span className="text-accent">продуманную структуру, понятную логику и то, чтобы всё работало без сбоев</span>{" "}
            у вас, а не только у меня на экране.
          </p>
          {/* gap-px + фон цвета линии = тонкие разделители между плитками */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5 bg-panel p-5">
                <b className="font-display text-[28px] font-normal">
                  <CountUp value={f.value} />
                </b>
                <span className="text-sm text-ash">{f.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
