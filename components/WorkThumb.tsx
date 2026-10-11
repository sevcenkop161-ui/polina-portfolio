import type { Work } from "@/data/site";

// SVG-заглушки для превью работ.
// Как только у работы появится image в data/site.ts, заглушка не нужна.
export default function WorkThumb({ thumb }: { thumb: Work["thumb"] }) {
  const svg = {
    viewBox: "0 0 320 200",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true,
    className: "absolute inset-0 h-full w-full",
  } as const;

  switch (thumb) {
    case "barber":
      // Барбершоп: тёмный фон, крупная надпись и полосатый «барбер-столб»
      return (
        <svg {...svg}>
          <rect width="320" height="200" fill="#171415" />
          <text x="24" y="112" fontFamily="var(--font-dela), Arial Black, sans-serif" fontSize="40" fill="#ece4df">BARBER</text>
          <text x="24" y="138" fontFamily="var(--font-jetbrains), monospace" fontSize="11" letterSpacing="3" fill="#9a8f91">BARBERSHOP · ЗАПИСЬ</text>
          <rect x="24" y="158" width="86" height="18" rx="9" fill="#c4224a" />
          <clipPath id="pole">
            <rect x="256" y="40" width="32" height="128" rx="16" />
          </clipPath>
          <g clipPath="url(#pole)">
            <rect x="256" y="40" width="32" height="128" fill="#ece4df" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={i} d={`M240 ${40 + i * 28} l64 -40 v14 l-64 40 z`} fill={i % 2 ? "#352d2f" : "#c4224a"} />
            ))}
          </g>
          <rect x="250" y="30" width="44" height="12" rx="6" fill="#352d2f" />
          <rect x="250" y="166" width="44" height="12" rx="6" fill="#352d2f" />
        </svg>
      );
    case "ink":
      return (
        <svg {...svg}>
          <rect width="320" height="200" fill="#ece4df" />
          <text x="24" y="104" fontFamily="var(--font-dela), Arial Black, sans-serif" fontSize="46" fill="#0f0d0e">INK</text>
          <text x="24" y="150" fontFamily="var(--font-dela), Arial Black, sans-serif" fontSize="46" fill="#0f0d0e">STUDIO</text>
          <circle cx="262" cy="64" r="26" fill="#c4224a" />
          <rect x="24" y="168" width="70" height="14" rx="7" fill="#0f0d0e" />
        </svg>
      );
    case "len":
      // Студия: тёмно-вишнёвый градиент, мягкая линия и спокойная типографика
      return (
        <svg {...svg}>
          <defs>
            <linearGradient id="len-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2a2426" />
              <stop offset="1" stopColor="#c4224a" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" fill="url(#len-bg)" />
          <path d="M-10 150 C60 110 110 180 170 140 S270 90 330 120" fill="none" stroke="#ece4df" strokeOpacity=".35" strokeWidth="2" />
          <text x="24" y="104" fontFamily="var(--font-dela), Arial Black, sans-serif" fontSize="52" fill="#ece4df">LEN</text>
          <text x="26" y="128" fontFamily="var(--font-jetbrains), monospace" fontSize="12" letterSpacing="6" fill="#ece4df" fillOpacity=".75">STUDIO</text>
          <circle cx="258" cy="70" r="30" fill="none" stroke="#c4224a" strokeWidth="3" />
          <circle cx="258" cy="70" r="8" fill="#c4224a" />
        </svg>
      );
    default:
      return <div className="absolute inset-0 bg-panel-2" />;
  }
}
