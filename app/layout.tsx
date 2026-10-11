import type { Metadata } from "next";
import { Dela_Gothic_One, Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// next/font скачивает шрифты при сборке и раздаёт их с нашего домена:
// нет запроса к Google при открытии сайта, нет «прыжка» текста.
// subsets: ["cyrillic"] обязателен, иначе русский текст будет системным шрифтом.
const dela = Dela_Gothic_One({ weight: "400", subsets: ["latin", "cyrillic"], variable: "--font-dela" });
const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-onest" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains" });

const title = "Полина Шевченко — сайты и лендинги под ключ";
const description =
  "Веб-разработчик Полина Шевченко. Делаю сайты и лендинги, которые приносят заявки, а также интернет-магазины и Telegram-ботов. Перед стартом показываю живое демо.";

// Адрес сайта нужен, чтобы ссылка на картинку-превью была полной (https://…/opengraph-image) —
// без этого Telegram и мессенджеры не покажут превью.
// Если появится свой домен, его можно задать переменной NEXT_PUBLIC_SITE_URL в настройках Vercel.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://polina-sites.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // og:image и apple-icon / icon Next.js добавит сам из файлов app/opengraph-image.tsx, app/icon.svg, app/apple-icon.png
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Полина Шевченко",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${dela.variable} ${onest.variable} ${jetbrains.variable}`}>
      <head>
        {/* Заголовки и плашки навыков спрятаны в CSS до начала анимации.
            Если JavaScript выключен, браузер применит этот стиль и покажет всё сразу.
            Скрипта здесь нет — поэтому нет ни ошибки React, ни мигания при загрузке. */}
        <noscript>
          <style>{".split-title{visibility:visible!important;animation:none!important}.skill-pile .skill-tag{opacity:1!important}"}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
