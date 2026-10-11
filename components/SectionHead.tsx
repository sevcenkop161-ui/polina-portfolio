import Reveal from "./Reveal";
import RevealTitle from "./RevealTitle";

// Заголовок секции: крупный h2 слева (появляется построчно), пояснение справа (на телефоне — под ним)
export default function SectionHead({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-[clamp(24px,4vw,40px)] grid items-end gap-5 md:grid-cols-[1fr_minmax(0,340px)]">
      <RevealTitle parts={[title]} />
      <Reveal delay={200}>
        <p className="text-ash">{text}</p>
      </Reveal>
    </div>
  );
}
