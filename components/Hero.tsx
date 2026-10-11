import { person } from "@/data/site";
import RevealTitle from "./RevealTitle";
import HeroPhoto from "./HeroPhoto";
import Magnetic from "./Magnetic";
import OrderStatus from "./OrderStatus";
import { orderMonth } from "@/lib/orderMonth";

export default function Hero() {
  return (
    <header
      id="top"
      className="panel relative grid scroll-mt-24 items-end gap-[clamp(20px,4vw,56px)] overflow-hidden md:grid-cols-[1.6fr_1fr]"
    >
      <div className="relative z-[2] flex min-w-0 flex-col gap-[22px]">
        <div className="mono flex flex-wrap items-baseline gap-3.5 normal-case">
          <b className="font-semibold">{person.name}</b>
          <span>{person.role}</span>
        </div>

        <span className="mono inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-[5px]">
          <i className="h-[7px] w-[7px] rounded-full bg-accent-2 shadow-[0_0_0_4px_#c4224a26]" />
          <OrderStatus prefix={person.status} initial={orderMonth()} />
        </span>

        <RevealTitle
          as="h1"
          immediate
          className="text-[clamp(40px,min(5.6vw,9.5svh),88px)] tracking-[-0.015em]"
          parts={["Сайты и лендинги", { text: "под ключ", className: "text-accent" }]}
        />

        <p className="max-w-[42ch] text-[17px] text-ash">
          Делаю сайты и лендинги, которые приносят заявки, а не просто красиво выглядят. Перед стартом
          показываю живое демо, чтобы вы сразу видели, что получите.
        </p>

        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <a className="btn btn-solid" href="#contact">
              обсудить проект
            </a>
          </Magnetic>
          <a className="btn" href="#works">
            смотреть работы
          </a>
        </div>
      </div>

      {/* На десктопе фото тянется на всю высоту блока — высокая узкая полоса, как в превью */}
      <HeroPhoto alt={`${person.name}, чёрно-белый портрет`} />
    </header>
  );
}
