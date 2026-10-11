// Генератор мокапов для портфолио.
// Запуск: node scripts/mockups.mjs
//
// 1) Playwright снимает первый экран каждого сайта: десктоп 1440×900 и телефон 390×844.
// 2) Скриншоты подставляются в HTML-сцену (стена, стол, ноутбук, телефон).
// 3) Сцена рендерится в PNG 1600×1000 и сохраняется в папку mockups/.
// 4) Для карточек на сайте в public/works/ кладутся: мокап, длинный скриншот
//    сайта (прокручивается в экране ноутбука) и отдельный слой с телефоном.

import { chromium } from "playwright";
import { mkdir, readFile, copyFile } from "node:fs/promises";
import path from "node:path";

const sites = [
  { file: "ink-studio", url: "https://ink-studio-swart.vercel.app" },
  { file: "stalbarber", url: "https://stal-barber.vercel.app" },
  { file: "len-studio", url: "https://len-studio.vercel.app" },
];

const OUT = path.resolve("mockups");
const SHOTS = path.join(OUT, "shots");
const SITE = path.resolve("public/works"); // сюда кладём файлы для карточек сайта

// Используем установленный Chrome, чтобы не скачивать отдельный браузер.
// Если в системе задан прокси (HTTPS_PROXY), передаём его браузеру.
// Логин и пароль прокси Playwright принимает отдельными полями, а не внутри адреса.
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
let proxy;
if (proxyUrl) {
  const u = new URL(proxyUrl);
  proxy = {
    server: `${u.protocol}//${u.host}`,
    username: decodeURIComponent(u.username) || undefined,
    password: decodeURIComponent(u.password) || undefined,
  };
}
const browser = await chromium.launch({ channel: "chrome", ...(proxy ? { proxy } : {}) });

await mkdir(SHOTS, { recursive: true });
await mkdir(SITE, { recursive: true });

// ── Этап 1: скриншоты ─────────────────────────────────────────
async function shoot(url, out, options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2500); // даём доиграть анимациям появления
  await page.screenshot({ path: out }); // только первый экран (без fullPage)
  await context.close();
}

// Длинный скриншот во всю высоту страницы.
// Сначала листаем до конца: иначе блоки с анимацией появления останутся
// невидимыми, а «ленивые» картинки не загрузятся.
async function shootFull(url, out) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.6 });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out, fullPage: true, type: "jpeg", quality: 72 });
  await context.close();
}

const reuseShots = process.argv.includes("--reuse-shots"); // node scripts/mockups.mjs --reuse-shots
for (const s of reuseShots ? [] : sites) {
  console.log(`📸 ${s.url}`);
  await shoot(s.url, path.join(SHOTS, `${s.file}-desktop.png`), {
    viewport: { width: 1440, height: 900 },
  });
  await shoot(s.url, path.join(SHOTS, `${s.file}-mobile.png`), {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, // двойная плотность — телефон на мокапе будет чётким
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  await shootFull(s.url, path.join(SITE, `${s.file}-full.jpg`));
}

// ── Этап 2: сборка сцены и рендер в PNG ───────────────────────
const toDataUri = async (file) => `data:image/png;base64,${(await readFile(file)).toString("base64")}`;

for (const s of sites) {
  const desktop = await toDataUri(path.join(SHOTS, `${s.file}-desktop.png`));
  const mobile = await toDataUri(path.join(SHOTS, `${s.file}-mobile.png`));

  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.setContent(scene(desktop, mobile));
  // ждём, пока скрипт в сцене измерит яркость скриншота и покрасит статус-бар
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  await page.waitForTimeout(200);
  const out = path.join(OUT, `${s.file}.png`);
  await page.screenshot({ path: out });
  await copyFile(out, path.join(SITE, `${s.file}.png`));

  // Слой «только телефон» на прозрачном фоне: на сайте он ляжет поверх
  // прокручиваемого экрана ноутбука, чтобы телефон по-прежнему его закрывал
  await page.addStyleTag({ content: "body > *:not(.phone), .phone.reflection { display: none !important; } html, body { background: transparent !important; }" });
  await page.screenshot({ path: path.join(SITE, `${s.file}-phone.png`), omitBackground: true });
  await page.close();
  console.log(`🖼  ${out}`);
}

await browser.close();

// ── HTML-сцена ────────────────────────────────────────────────
function scene(desktop, mobile) {
  // Клавиатура: ряды клавиш генерируем в цикле (широкие — Tab, Caps, Shift, Enter)
  const rows = [14, 14, 13, 12, 11]
    .map((n, r) => `<div class="row">${Array.from({ length: n }, (_, i) => {
      const wide = (r === 1 && i === 0) || (r === 2 && (i === 0 || i === n - 1)) || (r === 3 && (i === 0 || i === n - 1));
      const space = r === 4 && i === 5;
      return `<i class="${wide ? "w" : ""}${space ? "s" : ""}"></i>`;
    }).join("")}</div>`)
    .join("");

  const noise = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

  // Иконки статус-бара iPhone (цвет берут из currentColor)
  const statusIcons = `
    <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
    <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2.2c2.1 0 4 .8 5.4 2.1l1.1-1.1A9.2 9.2 0 0 0 7.5.6 9.2 9.2 0 0 0 1 3.2l1.1 1.1a7.7 7.7 0 0 1 5.4-2.1Zm0 3.2c1.2 0 2.3.5 3.1 1.2l1.1-1.1a6 6 0 0 0-8.4 0l1.1 1.1c.8-.7 1.9-1.2 3.1-1.2Zm0 3.2c-.5 0-.9.2-1.2.5L7.5 10.3l1.2-1.2c-.3-.3-.7-.5-1.2-.5Z"/></svg>
    <svg width="25" height="12" viewBox="0 0 25 12"><rect x=".5" y=".5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="18" height="8" rx="2"/><rect x="22.6" y="4" width="1.6" height="4" rx=".8" opacity=".45"/></svg>`;

  // Телефон описан один раз и используется дважды: сам телефон и его отражение в столе
  const phone = (cls) => `
  <div class="phone ${cls}">
    <span class="pbtn" style="left:-3px;top:112px;height:26px"></span>
    <span class="pbtn" style="left:-3px;top:156px;height:48px"></span>
    <span class="pbtn" style="left:-3px;top:212px;height:48px"></span>
    <span class="pbtn" style="right:-3px;top:172px;height:76px"></span>
    <div class="ph-bezel">
      <div class="ph-screen">
        <div class="status"><span class="time">9:41</span><span class="icons">${statusIcons}</span></div>
        <div class="shot"></div>
        <div class="island"><i></i></div>
        <div class="home"></div>
        <div class="glare"></div>
      </div>
    </div>
  </div>`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1600px; height: 1000px; overflow: hidden; background: #0d0c0f; position: relative;
    font-family: -apple-system, "SF Pro Text", "Segoe UI", system-ui, sans-serif; }

  /* ── Стена: тёмная штукатурка, свет сверху ── */
  .wall { position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 820px 560px at 56% -8%, rgba(255, 236, 214, .17), transparent 70%),
      radial-gradient(ellipse 1300px 900px at 50% 30%, #1b1a20, #0c0b0e 75%); }
  .vignette { position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 1150px 820px at 52% 42%, transparent 55%, rgba(0,0,0,.6)); }

  /* Фактура: SVG-слои поверх базового цвета */
  .tex { position: absolute; inset: 0; width: 1600px; height: 1000px; }
  .tex-relief { mix-blend-mode: hard-light; opacity: .26;
    -webkit-mask-image: radial-gradient(ellipse 1400px 1000px at 56% -5%, #000 30%, rgba(0,0,0,.55) 90%); }
  .tex-blot { mix-blend-mode: soft-light; opacity: .8; }
  .tex-pores { mix-blend-mode: multiply; opacity: .6; }

  /* Свечение экрана на стене: размытая копия скриншота */
  .screen-glow { position: absolute; left: 470px; top: 110px; width: 904px; height: 565px;
    background: url(${desktop}) center / cover; filter: blur(70px) saturate(1.5); opacity: .32; transform: scale(1.12); }

  /* ── Стол ── */
  .desk { position: absolute; left: 0; right: 0; bottom: 0; height: 215px; overflow: hidden;
    background: linear-gradient(#1d1b20, #121114 45%, #0b0a0d);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 -30px 60px rgba(0,0,0,.35); }
  .desk::after { content: ""; position: absolute; inset: 0; background-image: ${noise}; opacity: .06; mix-blend-mode: overlay; }

  /* ── Ноутбук ── */
  .laptop { position: absolute; left: 452px; top: 92px; width: 940px; }
  /* крышка: алюминиевый ободок */
  .lid { position: relative; padding: 3px; border-radius: 24px 24px 10px 10px;
    background: linear-gradient(180deg, #74757b, #3b3c41 6%, #2a2b2f 60%, #1f2023);
    box-shadow: 0 0 0 1px #0a0a0b, 0 30px 70px rgba(0,0,0,.5); }
  /* чёрная стеклянная рамка экрана */
  .bezel { position: relative; padding: 16px 16px 24px; border-radius: 21px 21px 8px 8px; background: #050506;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.05); }
  .cam { position: absolute; top: 6px; left: 50%; width: 6px; height: 6px; margin-left: -3px; border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #3a4a6a, #0b0d14 60%); box-shadow: 0 0 0 1.5px #16161b; }
  .screen { position: relative; aspect-ratio: 1440 / 900; border-radius: 3px; overflow: hidden;
    background: #000 url(${desktop}) center top / cover no-repeat; }
  /* блик на стекле: мягкий градиент + резкая диагональная граница */
  .screen::after { content: ""; position: absolute; inset: 0;
    background: linear-gradient(118deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,.035) 34%, transparent 34.2%); }
  .hinge { height: 12px; margin: 0 26px; border-radius: 0 0 5px 5px;
    background: linear-gradient(#08080a, #1d1e21 45%, #3b3c41 85%, #55565b); }

  /* корпус: плоскость с клавиатурой наклонена в 3D */
  .base { position: relative; height: 84px; perspective: 1600px; perspective-origin: 50% -220px; }
  .deck { position: absolute; left: -34px; right: -34px; top: -6px; height: 330px; transform-origin: 50% 0;
    transform: rotateX(77deg); transform-style: preserve-3d; border-radius: 0 0 28px 28px;
    background: linear-gradient(180deg, #46474c, #36373b 25%, #2d2e32 70%, #27282c);
    box-shadow: inset 0 3px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(255,255,255,.08);
    padding: 22px 34px 0; display: flex; flex-direction: column; align-items: center; }
  .top { display: flex; gap: 14px; width: 100%; }
  .grille { width: 74px; border-radius: 4px; opacity: .9;
    background: radial-gradient(circle, #0b0b0d 1.3px, transparent 1.6px) 0 0 / 7px 7px; }
  .keys { flex: 1; display: flex; flex-direction: column; gap: 7px; padding: 12px; border-radius: 9px;
    background: #0a0a0c; box-shadow: inset 0 2px 6px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.08); }
  .row { display: flex; gap: 7px; }
  .row i { flex: 1; height: 30px; border-radius: 6px; background: linear-gradient(#18181b, #0f0f11);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.09), 0 1px 1px rgba(0,0,0,.8); }
  .row i.w { flex: 1.7; } .row i.s { flex: 5.5; }
  .pad { width: 320px; height: 84px; margin-top: 14px; border-radius: 11px;
    background: linear-gradient(#3a3b40, #303135); box-shadow: inset 0 0 0 1px rgba(255,255,255,.07), 0 1px 0 rgba(0,0,0,.4); }
  /* передний торец, развёрнут к зрителю */
  .front { position: absolute; left: 0; right: 0; bottom: 0; height: 16px; transform-origin: 50% 100%;
    transform: rotateX(-90deg); border-radius: 0 0 24px 24px;
    background: linear-gradient(#64656a, #3a3b3f 18%, #232427 70%, #131315); }
  .front::after { content: ""; position: absolute; left: 50%; top: 0; width: 150px; height: 6px; margin-left: -75px;
    border-radius: 0 0 8px 8px; background: linear-gradient(#141416, #2a2b2f); }
  /* тени: широкая мягкая + плотная контактная */
  .shadow-laptop { position: absolute; left: 362px; top: 770px; width: 1120px; height: 64px; border-radius: 50%;
    background: rgba(0,0,0,.7); filter: blur(30px); }
  .contact-laptop { position: absolute; left: 420px; top: 812px; width: 1004px; height: 14px; border-radius: 50%;
    background: rgba(0,0,0,.85); filter: blur(6px); }

  /* ── Телефон ── */
  .phone { position: absolute; left: 232px; top: 336px; width: 272px; padding: 4px; border-radius: 52px;
    /* титановая рамка: блики по краям и в центре */
    background: linear-gradient(90deg, #8a8b90, #3a3b3f 4%, #5b5c61 30%, #6d6e73 50%, #4a4b50 75%, #2f3034 96%, #7c7d82);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.25), 0 0 0 1px #0b0b0c, 0 40px 70px rgba(0,0,0,.6), 0 12px 24px rgba(0,0,0,.5); }
  .ph-bezel { padding: 7px; border-radius: 48px; background: #000; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
  .ph-screen { position: relative; aspect-ratio: 390 / 844; border-radius: 41px; overflow: hidden;
    display: flex; flex-direction: column; background: #000; }
  /* статус-бар: фон — верхний ряд пикселей скриншота, растянутый по высоте */
  .status { position: relative; height: 38px; flex: none; display: flex; align-items: center; justify-content: space-between;
    padding: 4px 17px 0 27px; color: var(--sb, #fff);
    background: url(${mobile}) center top / 100% 8000% no-repeat; }
  .time { font-size: 13px; font-weight: 600; letter-spacing: -.01em; }
  .icons { display: flex; gap: 4px; align-items: center; transform: scale(.88); transform-origin: right center; }
  .icons svg { fill: currentColor; }
  .shot { flex: 1; background: url(${mobile}) center top / cover no-repeat; }
  .island { position: absolute; top: 10px; left: 50%; width: 72px; height: 22px; margin-left: -36px; border-radius: 12px; background: #000; }
  .island i { position: absolute; right: 8px; top: 5.5px; width: 11px; height: 11px; border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #2c3a5c, #070910 65%); }
  .home { position: absolute; bottom: 6px; left: 50%; width: 92px; height: 4px; margin-left: -46px; border-radius: 3px;
    background: var(--hi, #fff); opacity: .75; }
  .glare { position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(125deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.03) 38%, transparent 38.3%); }
  .pbtn { position: absolute; width: 4px; border-radius: 2px;
    background: linear-gradient(90deg, #2c2d31, #7d7e83, #3a3b3f); }
  /* отражение телефона в столе */
  /* копия стоит сразу под телефоном и перевёрнута вокруг своего центра;
     маска оставляет видимой только полосу у нижнего края телефона */
  .reflection { top: 902px; transform: scaleY(-1); opacity: .16; filter: blur(1.5px); box-shadow: none;
    -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 18%); }
  .shadow-phone { position: absolute; left: 205px; top: 880px; width: 330px; height: 40px; border-radius: 50%;
    background: rgba(0,0,0,.75); filter: blur(18px); }
  .contact-phone { position: absolute; left: 252px; top: 896px; width: 232px; height: 10px; border-radius: 50%;
    background: rgba(0,0,0,.9); filter: blur(4px); }
</style></head><body>
  <div class="wall"></div>
  ${plasterWall()}
  <div class="screen-glow"></div>
  <div class="desk"></div>
  <div class="shadow-laptop"></div>
  <div class="contact-laptop"></div>
  <div class="laptop">
    <div class="lid"><div class="bezel"><span class="cam"></span><div class="screen"></div></div></div>
    <div class="hinge"></div>
    <div class="base"><div class="deck">
      <div class="top"><div class="grille"></div><div class="keys">${rows}</div><div class="grille"></div></div>
      <div class="pad"></div>
      <div class="front"></div>
    </div></div>
  </div>
  ${phone("reflection")}
  <div class="shadow-phone"></div>
  <div class="contact-phone"></div>
  ${phone("")}
  <div class="vignette"></div>
  <script>
    // Меряем яркость верха и низа мобильного скриншота: на светлом фоне
    // значки статус-бара и полоска «домой» будут чёрными, на тёмном — белыми.
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const lum = (y) => { const [r, g, b] = ctx.getImageData(20, y, 1, 1).data; return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      document.body.style.setProperty("--sb", lum(10) > 150 ? "#111" : "#fff");
      document.body.style.setProperty("--hi", lum(img.height - 20) > 150 ? "#111" : "#fff");
      document.body.dataset.ready = "1";
    };
    img.src = "${mobile}";
  </script>
</body></html>`;
}

// ── Штукатурка с трещинами ────────────────────────────────────
// Генератор случайных чисел с фиксированным зерном: трещины одинаковые при каждом запуске
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function plasterWall() {
  const rand = mulberry32(7);
  // Трещина: идём шагами. Направление = основное + медленный дрейф (ограничен)
  // + резкий мелкий излом на каждом шаге. Так линия ломается, но не закручивается.
  const crack = (x, y, base, length, jitter = 0.45, step = 9) => {
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    let drift = 0;
    for (let i = 0; i < length / step; i++) {
      drift = Math.max(-0.35, Math.min(0.35, drift + (rand() - 0.5) * 0.12));
      const angle = base + drift + (rand() - 0.5) * jitter * 2;
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  };
  const H = Math.PI / 2;
  const main = crack(-20, 300, 0.01, 1680, 0.35);               // длинная горизонтальная
  const cracks = [
    main,
    crack(318, -10, H, 320),                                     // вертикальные
    crack(1488, 300, H + 0.05, 480),
    crack(1530, -10, H - 0.1, 310),
    crack(120, 300, H + 0.25, 110, 0.5),                          // короткие ответвления
    crack(30, 85, 0.25, 170, 0.5),
    crack(1290, 30, 2.75, 150, 0.5),
    crack(720, -10, H + 0.2, 75, 0.5),
  ];

  return `
  <svg class="tex tex-relief" viewBox="0 0 1600 1000" aria-hidden="true">
    <!-- рельеф: крупные мазки шпателя + мелкое зерно, освещённые сверху -->
    <filter id="plaster" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="4" seed="5" result="big"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="8" result="fine"/>
      <feComposite in="big" in2="fine" operator="arithmetic" k2="1" k3="0.4" result="height"/>
      <feDiffuseLighting in="height" surfaceScale="7" diffuseConstant="1" lighting-color="#fff">
        <feDistantLight azimuth="270" elevation="42"/>
      </feDiffuseLighting>
      <!-- сдвигаем яркость вниз: в среднем слой нейтральный и не высветляет тёмную стену -->
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.1" intercept="-0.32"/><feFuncG type="linear" slope="1.1" intercept="-0.32"/><feFuncB type="linear" slope="1.1" intercept="-0.32"/>
      </feComponentTransfer>
    </filter>
    <rect width="1600" height="1000" filter="url(#plaster)"/>
  </svg>
  <svg class="tex tex-blot" viewBox="0 0 1600 1000" aria-hidden="true">
    <!-- лёгкая неравномерность цвета -->
    <filter id="blot" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.003 0.004" numOctaves="4" seed="21"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="1600" height="1000" filter="url(#blot)"/>
  </svg>
  <svg class="tex tex-pores" viewBox="0 0 1600 1000" aria-hidden="true">
    <!-- поры: только самые тёмные точки шума -->
    <filter id="pores" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 0 0 0 1.2"/>
    </filter>
    <rect width="1600" height="1000" filter="url(#pores)"/>
  </svg>
  <svg class="tex" viewBox="0 0 1600 1000" aria-hidden="true">
    <defs>
      <!-- делает линии трещин неровными -->
      <filter id="wiggle" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="t"/>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="4" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="soft"><feGaussianBlur stdDeviation="1.6"/></filter>
    </defs>
    <!-- наплыв штукатурки вдоль главной трещины -->
    <path d="${main}" transform="translate(0 6)" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="9" filter="url(#soft)"/>
    <g filter="url(#wiggle)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <!-- светлый край под трещиной -->
      <g stroke="#fff" stroke-opacity=".13" stroke-width="1.4" transform="translate(0 1.6)">${cracks.map((d) => `<path d="${d}"/>`).join("")}</g>
      <!-- сама трещина -->
      <g stroke="#000" stroke-opacity=".85" stroke-width="1.6">${cracks.map((d) => `<path d="${d}"/>`).join("")}</g>
    </g>
  </svg>`;
}
