import Image from "next/image";

// Фото в hero + подпись «Полина», которая дописывается при загрузке (анимация .sig-write в globals.css)
export default function HeroPhoto({ alt }: { alt: string }) {
  return (
    <div className="relative min-w-0 max-w-[420px] md:max-w-none md:self-stretch">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] md:aspect-auto md:h-full md:min-h-[380px]">
        <Image
          src="/photo.jpg"
          alt={alt}
          fill
          priority
          sizes="(min-width: 900px) 40vw, 420px"
          className="object-cover contrast-[1.05]"
        />
        {/* затемнение снизу, чтобы подпись читалась на любом фоне */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />
      </div>
      <span
        aria-hidden="true"
        className="sig-write pointer-events-none absolute bottom-5 left-5 font-display text-[32px] uppercase leading-none text-bone md:text-[44px]"
      >
        Полина
      </span>
    </div>
  );
}
