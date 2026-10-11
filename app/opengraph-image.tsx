import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Картинка для превью ссылки в Telegram и мессенджерах (og:image).
// Next.js рисует её один раз при сборке и сам прописывает тег og:image.
export const alt = "Полина Шевченко — сайты и лендинги под ключ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const INK = "#0f0d0e";
const BONE = "#ece4df";
const ASH = "#9a8f91";
const CHERRY = "#c4224a";

export default async function OpengraphImage() {
  // Satori (движок картинки) понимает TTF, а не woff2 — поэтому шрифты лежат в assets/fonts
  const [dela, onest, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/DelaGothicOne-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Onest-Medium.ttf")),
    readFile(join(process.cwd(), "public/photo.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: INK, color: BONE, fontFamily: "Onest" }}>
        {/* левая часть: имя и заголовок */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            padding: "64px 0 64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* логотип: два вишнёвых овала */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ width: 30, height: 17, borderRadius: 9, background: CHERRY }} />
              <div style={{ width: 30, height: 17, borderRadius: 9, background: CHERRY }} />
            </div>
            <div style={{ fontSize: 32 }}>Полина Шевченко</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Dela Gothic One",
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -1,
            }}
          >
            <div>САЙТЫ И</div>
            <div>ЛЕНДИНГИ</div>
            <div style={{ color: CHERRY }}>ПОД КЛЮЧ</div>
          </div>

          <div style={{ fontSize: 26, color: ASH }}>веб-разработчик · живое демо перед стартом</div>
        </div>

        {/* правая часть: ч/б фото, левый край растворяется в фоне */}
        <div style={{ display: "flex", position: "relative", width: 440, height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoSrc} alt="" width={440} height={630} style={{ objectFit: "cover", objectPosition: "center" }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 160,
              height: "100%",
              background: `linear-gradient(to right, ${INK}, rgba(15,13,14,0))`,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Dela Gothic One", data: dela, weight: 400, style: "normal" },
        { name: "Onest", data: onest, weight: 500, style: "normal" },
      ],
    },
  );
}
