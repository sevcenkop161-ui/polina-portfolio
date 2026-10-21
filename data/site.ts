// ─────────────────────────────────────────────────────────────
//  ВСЕ ДАННЫЕ САЙТА В ОДНОМ ФАЙЛЕ.
//  Добавить работу: скопируй любой объект в `works` и поправь.
//  Показать скриншот: положи файл в public/works/ и укажи
//  image: "/works/имя-файла.jpg". Без image показывается
//  SVG-заглушка из components/WorkThumb.tsx (поле thumb).
// ─────────────────────────────────────────────────────────────

export const person = {
  name: "Полина Шевченко",
  role: "Веб-разработчик",
  status: "беру заказы на", // месяц подставляется автоматически (components/OrderStatus.tsx)
};

export const contacts = {
  telegramUsername: "polina_sites", // ник без @ — из него собираются ссылки tg:// и https://t.me/
  telegramLabel: "@polina_sites",
  kwork: "https://kwork.ru/user/sevcencop161",
  kworkLabel: "sevcencop161",
};

export type Work = {
  title: string;
  kind: string;          // мелкая подпись над названием
  description: string;
  tags: string[];        // плашки поверх превью
  thumb?: "barber" | "ink" | "len"; // SVG-заглушка, пока нет скриншота
  image?: string;        // мокап из public/, например "/works/stalbarber.png"
  scroll?: string;       // длинный скриншот сайта — прокручивается в экране ноутбука при наведении
  front?: string;        // слой «только телефон», ложится поверх экрана ноутбука
  link?: string;         // ссылка на живой сайт
};

export const works: Work[] = [
  {
    title: "MOM кондитер",
    kind: "сайт кондитера",
    description: "Сайт-визитка для домашнего кондитера: каталог тортов и начинок, клиент выбирает десерт и отправляет заказ в Telegram в один клик. Хозяйка сама меняет цены, даты и добавляет новые десерты через простую админку.",
    tags: ["каталог десертов", "заказ в Telegram", "админка для клиента", "адаптив"],
    image: "/works/momkonditer.png",
    scroll: "/works/momkonditer-full.jpg",
    front: "/works/momkonditer-phone.png",
    link: "https://momkonditer.github.io",
  },
  {
    title: "Stal Barber",
    kind: "сайт барбершопа",
    description: "Барбершоп: стрижки и борода без лишних слов. Мастера, работы, услуги и онлайн-запись за пару минут.",
    tags: ["сайт", "онлайн-запись"],
    thumb: "barber",
    image: "/works/stalbarber.png",
    scroll: "/works/stalbarber-full.jpg",
    front: "/works/stalbarber-phone.png",
    link: "https://stal-barber.vercel.app",
  },
  {
    title: "Ink Studio",
    kind: "сайт тату-студии",
    description: "Сайт для тату-студии: выразительная типографика, мастера, галерея работ и запись на сеанс.",
    tags: ["сайт", "онлайн-запись"],
    thumb: "ink",
    image: "/works/ink-studio.png",
    scroll: "/works/ink-studio-full.jpg",
    front: "/works/ink-studio-phone.png",
    link: "https://ink-studio-swart.vercel.app",
  },
  {
    title: "ЛЁН",
    kind: "сайт студии красоты",
    description: "Студия красоты: маникюр, ресницы, брови. Спокойный светлый дизайн и бронирование онлайн.",
    tags: ["сайт", "онлайн-запись"],
    thumb: "len",
    image: "/works/len-studio.png",
    scroll: "/works/len-studio-full.jpg",
    front: "/works/len-studio-phone.png",
    link: "https://len-studio.vercel.app",
  },
];

export type Service = {
  title: string;
  description: string;
  price: string;
  term: string;
};

export const services: Service[] = [
  { title: "Лендинг", description: "Одностраничный сайт: визитка, промо или продажа одной услуги. Адаптив под телефон и форма заявки.", term: "срок 1–3 дня", price: "от 15 000 ₽" },
  { title: "Интернет-магазин", description: "Каталог с фильтрами, корзина, оформление заказа и онлайн-оплата. Удобно управлять товарами и заказами.", term: "срок 7–14 дней", price: "от 25 000 ₽" },
  { title: "Telegram-бот", description: "Запись клиентов, приём заявок, рассылки, уведомления, простые каталоги и оплата.", term: "срок 1–4 дня", price: "от 5 000 ₽" },
  { title: "Дашборд", description: "Интерактивная панель с графиками и фильтрами: продажи, цены, заявки, любые ваши цифры.", term: "срок 2–5 дней", price: "от 5 000 ₽" },
  { title: "Презентация", description: "Слайды для питча, отчёта или выступления: структура, дизайн, графики.", term: "срок 1–2 дня", price: "от 1 500 ₽" },
];

export const steps = [
  { title: "Бриф", text: "Обсуждаем задачу, примеры, сроки. Называю точную цену." },
  { title: "Прототип", text: "Показываю структуру и первый рабочий вариант." },
  { title: "Сборка", text: "Довожу до готового продукта, вношу ваши правки." },
  { title: "Запуск", text: "Публикую, подключаю домен или бота, объясняю, как всем пользоваться." },
];

export const stack = ["next.js", "react", "typescript", "tailwind", "supabase", "python", "telegram bot api"];

export const facts = [
  { value: "4", label: "проекта в портфолио" },
  { value: "от 1 дня", label: "на простой лендинг" },
  { value: "демо", label: "к каждой работе можно потрогать руками" },
  { value: "правки", label: "включены в стоимость" },
];
