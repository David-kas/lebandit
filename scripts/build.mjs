import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderPage, SITE, UI } from "./layout.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const CONTENT_HTML = path.join(ROOT, "content", "html");

const PAYMENTS = [
  "visa",
  "mastercard",
  "bitcoin",
  "ethereum",
  "qiwi",
  "usdt",
  "tron",
  "skrill",
  "neteller",
  "apple-pay",
];

const BLOG_SLUGS = [
  "le-bandit-demo-v-rublyah",
  "kak-vyigrat-v-le-bandit",
  "luchshie-simvoly-le-bandit",
  "hacksaw-gaming-sloty",
];

function readBody(slug, lang) {
  const f = path.join(CONTENT_HTML, `${slug}.${lang}.html`);
  if (!fs.existsSync(f)) {
    console.warn("Missing body:", f);
    return `<p>Content missing: ${slug} (${lang})</p>`;
  }
  return fs.readFileSync(f, "utf8");
}

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function assetPrefix(fromFileDir) {
  const depth = fromFileDir
    ? fromFileDir.split(/[/\\]/).filter(Boolean).length
    : 0;
  return depth > 0 ? "../".repeat(depth) : "";
}

function relHref(fromFileDir, targetDistPath) {
  const fromFile = path.join(DIST, fromFileDir || ".", "index.html");
  const toFile = path.join(DIST, targetDistPath);
  return path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
}

function distPathForLang(lang, segments) {
  if (lang === "ru") {
    if (!segments.length) return "index.html";
    return `${segments.join("/")}/index.html`;
  }
  if (!segments.length) return `${lang}/index.html`;
  return `${lang}/${segments.join("/")}/index.html`;
}

function fileDirForLang(lang, segments) {
  if (lang === "ru") {
    if (!segments.length) return "";
    return segments.join("/");
  }
  if (!segments.length) return lang;
  return `${lang}/${segments.join("/")}`;
}

function canonicalForLang(lang, segments) {
  if (lang === "ru") {
    if (!segments.length) return "/";
    return `/${segments.join("/")}/`;
  }
  if (!segments.length) return `/${lang}/`;
  return `/${lang}/${segments.join("/")}/`;
}

const PAGE_DEFS = [
  { segments: [], slug: "home", showHero: true },
  { segments: ["demo"], slug: "demo", showHero: true },
  { segments: ["play"], slug: "play", showHero: true },
  { segments: ["review"], slug: "review", showHero: true },
  { segments: ["download"], slug: "download", showHero: true },
  { segments: ["how-to-win"], slug: "how-to-win", showHero: true },
  { segments: ["strategy"], slug: "strategy", showHero: true },
  { segments: ["bonus-buy"], slug: "bonus-buy", showHero: true },
  { segments: ["payments"], slug: "payments", showHero: true },
  ...PAYMENTS.map((p) => ({
    segments: ["payments", p],
    slug: `payments__${p.replace(/-/g, "_")}`,
    showHero: false,
  })),
  { segments: ["android"], slug: "android", showHero: true },
  { segments: ["iphone"], slug: "iphone", showHero: true },
  { segments: ["pc"], slug: "pc", showHero: true },
  { segments: ["apk"], slug: "apk", showHero: true },
  { segments: ["faq"], slug: "faq", showHero: true },
  { segments: ["blog"], slug: "blog", showHero: true },
  ...BLOG_SLUGS.map((b) => ({
    segments: ["blog", b],
    slug: `blog__${b.replace(/-/g, "_")}`,
    showHero: false,
  })),
  { segments: ["terms"], slug: "terms", showHero: false },
  { segments: ["privacy"], slug: "privacy", showHero: false },
];

function metaFor(slug, lang) {
  const m = META[slug]?.[lang];
  if (!m) {
    return {
      title: "Le Bandit Slot",
      description: "Le Bandit slot by Hacksaw Gaming.",
    };
  }
  return m;
}

const META = {
  home: {
    ru: {
      title:
        "Le Bandit Slot — играть онлайн бесплатно и на деньги | Hacksaw Gaming",
      description:
        "Le Bandit слот: демо, высокий RTP, бонус-раунды, волатильность, символы wild и множители. Играйте в казино слот Le Bandit онлайн — бесплатно или на реальные деньги.",
    },
    en: {
      title: "Le Bandit Slot — Play Online Free & Real Money | Hacksaw Gaming",
      description:
        "Le Bandit slot demo, RTP, volatility, bonus rounds, wild symbols & multipliers. Play the Hacksaw Gaming casino slot online — free or real money.",
    },
    es: {
      title: "Le Bandit Slot — Jugar online gratis y con dinero | Hacksaw Gaming",
      description:
        "Tragamonedas Le Bandit: demo, RTP, volatilidad, bonus, wilds y multiplicadores. Juega al slot de Hacksaw Gaming en línea gratis o con dinero real.",
    },
  },
  demo: {
    ru: {
      title: "Le Bandit демо — бесплатный режим и спины без регистрации",
      description:
        "Le Bandit демо в рублях и других валютах: как запустить демо режим, тестировать барабаны и бонус раунд без депозита. Казино слот Hacksaw Gaming.",
    },
    en: {
      title: "Le Bandit Demo — Free Play & Spins (No Registration)",
      description:
        "Le Bandit demo mode: practice spins, bonus rounds, and reels without a deposit. Hacksaw Gaming slot free play guide.",
    },
    es: {
      title: "Demo Le Bandit — juego gratis y giros sin registro",
      description:
        "Demo de Le Bandit: practica giros, bonus y rodillos sin depósito. Guía del slot Hacksaw Gaming en modo gratuito.",
    },
  },
  play: {
    ru: {
      title: "Le Bandit играть — онлайн казино, реальные ставки и быстрые спины",
      description:
        "Как играть в Le Bandit на деньги: лимиты, волатильность, бонус buy и ответственная игра. Слот Hacksaw Gaming в онлайн казино.",
    },
    en: {
      title: "Play Le Bandit Online — Real Money Casino Slot",
      description:
        "How to play Le Bandit for real money: limits, volatility, bonus buy & safer gambling tips. Hacksaw Gaming online casino slot.",
    },
    es: {
      title: "Jugar Le Bandit online — tragamonedas con dinero real",
      description:
        "Cómo jugar Le Bandit con dinero real: límites, volatilidad, bonus buy y juego responsable. Slot Hacksaw Gaming.",
    },
  },
  review: {
    ru: {
      title: "Обзор слота Le Bandit — механики, RTP и бонусная игра",
      description:
        "Подробный обзор Le Bandit: RTP, волатильность, таблица выплат, символы wild, множители и бонусные вращения. Hacksaw Gaming.",
    },
    en: {
      title: "Le Bandit Slot Review — RTP, Features & Bonus Game",
      description:
        "In-depth Le Bandit review: RTP, volatility, paytable, wilds, multipliers & bonus spins. Hacksaw Gaming slot analysis.",
    },
    es: {
      title: "Reseña Le Bandit — RTP, funciones y bono",
      description:
        "Reseña completa de Le Bandit: RTP, volatilidad, tabla de pagos, wilds, multiplicadores y bonus. Hacksaw Gaming.",
    },
  },
  download: {
    ru: {
      title: "Скачать Le Bandit — мобильный слот и установка на телефон",
      description:
        "Как скачать и играть в Le Bandit на телефоне: Android, iPhone, APK и браузер. Быстрая загрузка казино слота Hacksaw Gaming.",
    },
    en: {
      title: "Download Le Bandit — Mobile Slot on Android & iPhone",
      description:
        "How to download and play Le Bandit on mobile: Android, iPhone, APK & browser. Hacksaw Gaming slot setup guide.",
    },
    es: {
      title: "Descargar Le Bandit — móvil Android e iPhone",
      description:
        "Cómo descargar y jugar Le Bandit en móvil: Android, iPhone, APK y navegador. Guía del slot Hacksaw Gaming.",
    },
  },
  "how-to-win": {
    ru: {
      title: "Как выиграть в Le Bandit — советы по банкроллу и бонусам",
      description:
        "Практичные советы для слота Le Bandit: банкролл, волатильность, множители и бонус раунд. Без гарантий выигрыша — только ответственная игра.",
    },
    en: {
      title: "How to Win on Le Bandit — Bankroll Tips & Bonus Play",
      description:
        "Practical tips for Le Bandit: bankroll, volatility, multipliers & bonus rounds. No guarantees — play responsibly.",
    },
    es: {
      title: "Cómo ganar en Le Bandit — bankroll y bonus",
      description:
        "Consejos prácticos para Le Bandit: bankroll, volatilidad, multiplicadores y bonus. Sin garantías — juega con responsabilidad.",
    },
  },
  strategy: {
    ru: {
      title: "Стратегия Le Bandit — сессии, ставки и управление риском",
      description:
        "Стратегии для казино слота Le Bandit: длина сессии, размер ставки, бонус buy и демо режим. Hacksaw Gaming.",
    },
    en: {
      title: "Le Bandit Strategy — Sessions, Stakes & Risk Control",
      description:
        "Slot strategy ideas for Le Bandit: session length, stake sizing, bonus buy & demo practice. Hacksaw Gaming.",
    },
    es: {
      title: "Estrategia Le Bandit — sesiones y control de riesgo",
      description:
        "Ideas de estrategia para Le Bandit: sesiones, apuestas, bonus buy y demo. Hacksaw Gaming.",
    },
  },
  "bonus-buy": {
    ru: {
      title: "Bonus Buy в Le Bandit — покупка бонуса и множители",
      description:
        "Как работает Bonus Buy в Le Bandit: цена бонуса, волатильность, ожидание по раундам и альтернативы. Слот Hacksaw Gaming.",
    },
    en: {
      title: "Le Bandit Bonus Buy — Feature Purchase Explained",
      description:
        "How Bonus Buy works in Le Bandit: pricing, volatility expectations & alternatives. Hacksaw Gaming slot guide.",
    },
    es: {
      title: "Bonus Buy en Le Bandit — compra de función",
      description:
        "Cómo funciona Bonus Buy en Le Bandit: precio, volatilidad y alternativas. Slot Hacksaw Gaming.",
    },
  },
  payments: {
    ru: {
      title: "Платежи для игры в Le Bandit — карты, крипто и кошельки",
      description:
        "Пополнение в онлайн казино для слота Le Bandit: Visa, Mastercard, криптовалюты, Qiwi, Skrill, Neteller и другие методы.",
    },
    en: {
      title: "Payments to Play Le Bandit — Cards, Crypto & Wallets",
      description:
        "Deposit methods for Le Bandit: Visa, Mastercard, crypto, e-wallets & more. Online casino payments overview.",
    },
    es: {
      title: "Pagos para jugar Le Bandit — tarjetas, cripto y monederos",
      description:
        "Métodos de depósito para Le Bandit: Visa, Mastercard, cripto, monederos y más. Resumen para casino online.",
    },
  },
  android: {
    ru: {
      title: "Le Bandit на Android — браузер, приложение и производительность",
      description:
        "Как играть в Le Bandit на Android: Chrome, PWA, APK и настройки для плавных спинов. Hacksaw Gaming слот.",
    },
    en: {
      title: "Le Bandit on Android — Browser, App & Performance",
      description:
        "Play Le Bandit on Android phones: browser tips, APK notes & smooth spins. Hacksaw Gaming slot.",
    },
    es: {
      title: "Le Bandit en Android — navegador, app y rendimiento",
      description:
        "Juega Le Bandit en Android: consejos de navegador, APK y giros fluidos. Slot Hacksaw Gaming.",
    },
  },
  iphone: {
    ru: {
      title: "Le Bandit на iPhone — iOS, Safari и мобильный слот",
      description:
        "Le Bandit на iPhone: Safari, стабильный интернет и игра без лагов. Советы для iOS и казино слота Hacksaw Gaming.",
    },
    en: {
      title: "Le Bandit on iPhone — Safari & iOS Slot Tips",
      description:
        "Play Le Bandit on iPhone with Safari & stable connectivity. Hacksaw Gaming mobile slot tips.",
    },
    es: {
      title: "Le Bandit en iPhone — Safari y consejos iOS",
      description:
        "Juega Le Bandit en iPhone con Safari y buena conexión. Consejos del slot Hacksaw Gaming.",
    },
  },
  pc: {
    ru: {
      title: "Le Bandit на ПК — полноэкранный режим и браузер",
      description:
        "Запуск Le Bandit на компьютере: Chrome/Edge, полный экран, горячие клавиши и комфортные сессии.",
    },
    en: {
      title: "Le Bandit on PC — Full Screen Browser Play",
      description:
        "Play Le Bandit on desktop: Chrome/Edge, fullscreen & comfortable sessions. Hacksaw Gaming slot.",
    },
    es: {
      title: "Le Bandit en PC — pantalla completa en navegador",
      description:
        "Juega Le Bandit en escritorio: Chrome/Edge y pantalla completa. Slot Hacksaw Gaming.",
    },
  },
  apk: {
    ru: {
      title: "Le Bandit APK — безопасная установка и альтернативы",
      description:
        "Про APK для казино слотов: риски сторонних файлов, проверка источника и безопасные способы играть в Le Bandit.",
    },
    en: {
      title: "Le Bandit APK — Safety, Sources & Alternatives",
      description:
        "APK guidance for casino slots: third-party risks & safer ways to play Le Bandit online.",
    },
    es: {
      title: "APK Le Bandit — seguridad y alternativas",
      description:
        "Guía APK para slots: riesgos y formas más seguras de jugar Le Bandit online.",
    },
  },
  faq: {
    ru: {
      title: "FAQ Le Bandit — демо, RTP, бонус и мобильная игра",
      description:
        "Ответы на частые вопросы о слоте Le Bandit: демо режим, регистрация, выплаты, волатильность и символы.",
    },
    en: {
      title: "Le Bandit FAQ — Demo, RTP, Bonus & Mobile",
      description:
        "Answers about Le Bandit: demo play, registration, payouts, volatility & symbols.",
    },
    es: {
      title: "FAQ Le Bandit — demo, RTP, bono y móvil",
      description:
        "Respuestas sobre Le Bandit: demo, registro, pagos, volatilidad y símbolos.",
    },
  },
  blog: {
    ru: {
      title: "Блог Le Bandit — гайды, стратегии и новости слота",
      description:
        "Статьи о Le Bandit: демо в рублях, выигрышные подходы, символы и обзор слотов Hacksaw Gaming.",
    },
    en: {
      title: "Le Bandit Blog — Guides & Hacksaw Gaming Slots",
      description:
        "Articles about Le Bandit: demo guides, symbols & Hacksaw Gaming slot features.",
    },
    es: {
      title: "Blog Le Bandit — guías y slots Hacksaw Gaming",
      description:
        "Artículos sobre Le Bandit: demo, símbolos y tragamonedas Hacksaw Gaming.",
    },
  },
  terms: {
    ru: {
      title: "Условия использования — Le Bandit Game",
      description:
        "Условия информационного сайта le-bandit-game.vercel.app об ограничении ответственности и 18+.",
    },
    en: {
      title: "Terms of Use — Le Bandit Game",
      description:
        "Terms for the informational site le-bandit-game.vercel.app, disclaimers & 18+.",
    },
    es: {
      title: "Términos de uso — Le Bandit Game",
      description:
        "Términos del sitio informativo le-bandit-game.vercel.app, descargos y 18+.",
    },
  },
  privacy: {
    ru: {
      title: "Политика конфиденциальности — Le Bandit Game",
      description:
        "Как обрабатываются данные на информационном сайте le-bandit-game.vercel.app.",
    },
    en: {
      title: "Privacy Policy — Le Bandit Game",
      description:
        "Privacy practices for the informational site le-bandit-game.vercel.app.",
    },
    es: {
      title: "Política de privacidad — Le Bandit Game",
      description:
        "Prácticas de privacidad del sitio informativo le-bandit-game.vercel.app.",
    },
  },
};

for (const p of PAYMENTS) {
  const key = `payments__${p.replace(/-/g, "_")}`;
  META[key] = {
    ru: {
      title: `Le Bandit — пополнение ${p.toUpperCase()} | Платежи казино`,
      description: `Как пополнить счёт для игры в Le Bandit через ${p}: лимиты, скорость, комиссии и безопасность. Онлайн казино слот Hacksaw Gaming.`,
    },
    en: {
      title: `Play Le Bandit with ${p.toUpperCase()} — Casino Payments`,
      description: `Deposit with ${p} to play Le Bandit: limits, speed, fees & safety tips. Hacksaw Gaming slot payments.`,
    },
    es: {
      title: `Jugar Le Bandit con ${p.toUpperCase()} — pagos casino`,
      description: `Deposita con ${p} para jugar Le Bandit: límites, velocidad y seguridad. Pagos en casino online.`,
    },
  };
}

for (const b of BLOG_SLUGS) {
  const key = `blog__${b.replace(/-/g, "_")}`;
  META[key] = {
    ru: {
      title: `Le Bandit блог — ${b.replace(/-/g, " ")}`,
      description: `Материал блога о слоте Le Bandit: ${b}. Hacksaw Gaming, демо режим и бонус раунды.`,
    },
    en: {
      title: `Le Bandit blog — ${b.replace(/-/g, " ")}`,
      description: `Le Bandit article: ${b}. Hacksaw Gaming slot insights, demo & bonus play.`,
    },
    es: {
      title: `Blog Le Bandit — ${b.replace(/-/g, " ")}`,
      description: `Artículo Le Bandit: ${b}. Slot Hacksaw Gaming, demo y bonus.`,
    },
  };
}

function defaultFaqs(lang) {
  if (lang === "ru")
    return [
      {
        q: "Есть ли у Le Bandit демо режим?",
        a: "Да, большинство операторов предлагают демо режим: вы крутите барабаны на условные кредиты и изучаете бонус раунд без риска для бюджета.",
      },
      {
        q: "Какой RTP у слота Le Bandit?",
        a: "Публичные спецификации Hacksaw Gaming обычно указывают конкурентный RTP; точное значение зависит от рынка и казино. Проверяйте таблицу помощи внутри игры.",
      },
      {
        q: "Можно ли играть без регистрации?",
        a: "В демо часто можно играть без регистрации, но для реальных денег требуется аккаунт и верификация по правилам оператора.",
      },
    ];
  if (lang === "en")
    return [
      {
        q: "Does Le Bandit have a demo mode?",
        a: "Most operators offer a demo so you can spin the reels with play credits and learn the bonus round risk-free.",
      },
      {
        q: "What is the RTP of Le Bandit?",
        a: "Hacksaw Gaming publishes competitive RTP ranges; the exact value may vary by market and casino. Check the in-game help.",
      },
      {
        q: "Can I play without registration?",
        a: "Demo play may be available without signup, but real-money play requires an account and operator verification.",
      },
    ];
  return [
    {
      q: "¿Le Bandit tiene modo demo?",
      a: "Sí, muchos operadores ofrecen demo para practicar giros y el bonus sin arriesgar tu bankroll.",
    },
    {
      q: "¿Cuál es el RTP de Le Bandit?",
      a: "Hacksaw Gaming publica rangos competitivos; el valor exacto puede variar. Consulta la ayuda dentro del juego.",
    },
    {
      q: "¿Puedo jugar sin registro?",
      a: "La demo a veces no requiere registro, pero el dinero real sí requiere cuenta y verificación.",
    },
  ];
}

function defaultReviews(lang) {
  if (lang === "ru")
    return [
      {
        author: "Алексей, Москва",
        rating: 5,
        body: "Крутой визуал и динамичные бонусные вращения. Демо режим помог понять множители до реальных ставок.",
      },
      {
        author: "Марина, Казань",
        rating: 4,
        body: "Волатильность ощущается — лучше заранее планировать банкролл. В целом один из сильных слотов Hacksaw Gaming.",
      },
    ];
  if (lang === "en")
    return [
      {
        author: "Chris, UK",
        rating: 5,
        body: "Sharp art direction and punchy bonus pacing. The demo made it easy to learn the features before real play.",
      },
      {
        author: "Laura, CA",
        rating: 4,
        body: "High volatility — sessions swing hard. Still one of my favorite Hacksaw Gaming releases.",
      },
    ];
  return [
    {
      author: "Diego, ES",
      rating: 5,
      body: "Gran estética y bonus intenso. La demo ayudó a entender multiplicadores y símbolos wild.",
    },
    {
      author: "Lucía, MX",
      rating: 4,
      body: "Alta volatilidad: gestiona bien tu bankroll. Muy buen slot de Hacksaw Gaming.",
    },
  ];
}

function internalLinkPool(lang, fromFileDir) {
  const targets = [
    ["demo", ["demo"]],
    ["play", ["play"]],
    ["review", ["review"]],
    ["download", ["download"]],
    ["how-to-win", ["how-to-win"]],
    ["strategy", ["strategy"]],
    ["bonus-buy", ["bonus-buy"]],
    ["payments", ["payments"]],
    ["android", ["android"]],
    ["iphone", ["iphone"]],
    ["pc", ["pc"]],
    ["apk", ["apk"]],
    ["faq", ["faq"]],
    ["blog", ["blog"]],
  ];
  const labels =
    lang === "ru"
      ? {
          demo: "Демо Le Bandit",
          play: "Играть онлайн",
          review: "Обзор слота",
          download: "Скачать",
          "how-to-win": "Как выиграть",
          strategy: "Стратегия",
          "bonus-buy": "Bonus Buy",
          payments: "Платежи",
          android: "Android",
          iphone: "iPhone",
          pc: "ПК",
          apk: "APK",
          faq: "FAQ",
          blog: "Блог",
        }
      : lang === "en"
        ? {
            demo: "Le Bandit demo",
            play: "Play online",
            review: "Slot review",
            download: "Download",
            "how-to-win": "How to win",
            strategy: "Strategy",
            "bonus-buy": "Bonus buy",
            payments: "Payments",
            android: "Android",
            iphone: "iPhone",
            pc: "PC",
            apk: "APK",
            faq: "FAQ",
            blog: "Blog",
          }
        : {
            demo: "Demo Le Bandit",
            play: "Jugar online",
            review: "Reseña",
            download: "Descargar",
            "how-to-win": "Cómo ganar",
            strategy: "Estrategia",
            "bonus-buy": "Bonus buy",
            payments: "Pagos",
            android: "Android",
            iphone: "iPhone",
            pc: "PC",
            apk: "APK",
            faq: "FAQ",
            blog: "Blog",
          };

  return targets.map(([key, segs]) => ({
    label: labels[key],
    href: relHref(fromFileDir, distPathForLang(lang, segs)),
  }));
}

function navHtml(lang, fromFileDir, activeSegments) {
  const active = activeSegments.join("/");
  const items = UI[lang].nav
    .map(([label, slug]) => {
      const segs = slug ? slug.split("/") : [];
      const href = relHref(fromFileDir, distPathForLang(lang, segs));
      const isActive =
        slug === ""
          ? active === ""
          : active === slug || active.startsWith(`${slug}/`);
      return `<li><a href="${href}" ${isActive ? 'aria-current="page"' : ""}>${label}</a></li>`;
    })
    .join("\n          ");
  return items;
}

function langSwitch(lang, fromFileDir, segments) {
  const make = (targetLang) => {
    const href = relHref(fromFileDir, distPathForLang(targetLang, segments));
    const cur = targetLang === lang ? ' aria-current="true"' : "";
    return `<a href="${href}" hreflang="${targetLang}"${cur}>${targetLang.toUpperCase()}</a>`;
  };
  return `${make("ru")}${make("en")}${make("es")}`;
}

function breadcrumbJsonLd(lang, segments, names) {
  const items = [];
  const homeUrl = `${SITE}${canonicalForLang(lang, [])}`;
  items.push({
    "@type": "ListItem",
    position: 1,
    name: lang === "ru" ? "Главная" : lang === "en" ? "Home" : "Inicio",
    item: homeUrl,
  });
  let acc = [];
  for (let i = 0; i < segments.length; i++) {
    acc.push(segments[i]);
    const url = `${SITE}${canonicalForLang(lang, acc)}`;
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: names[i],
      item: url,
    });
  }
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    },
    null,
    0
  );
}

function heroFor(slug, lang, fromFileDir, segments) {
  const demoHref = relHref(fromFileDir, distPathForLang(lang, ["demo"]));
  if (slug === "home") {
    const stats =
      lang === "ru"
        ? `<div class="stat"><strong>96%+</strong><span>RTP (зависит от казино)</span></div><div class="stat"><strong>Hacksaw</strong><span>провайдер</span></div><div class="stat"><strong>Бонус</strong><span>раунды</span></div>`
        : lang === "en"
          ? `<div class="stat"><strong>96%+</strong><span>RTP (casino dependent)</span></div><div class="stat"><strong>Hacksaw</strong><span>provider</span></div><div class="stat"><strong>Bonus</strong><span>features</span></div>`
          : `<div class="stat"><strong>96%+</strong><span>RTP (según casino)</span></div><div class="stat"><strong>Hacksaw</strong><span>proveedor</span></div><div class="stat"><strong>Bonus</strong><span>funciones</span></div>`;
    return {
      badge:
        lang === "ru"
          ? "★ Премиум казино слот"
          : lang === "en"
            ? "★ Premium casino slot"
            : "★ Tragamonedas premium",
      h1:
        lang === "ru"
          ? `Le Bandit Slot — <span class="accent">играть онлайн</span> бесплатно и на деньги`
          : lang === "en"
            ? `Le Bandit Slot — <span class="accent">play online</span> free & real money`
            : `Le Bandit Slot — <span class="accent">jugar online</span> gratis y con dinero`,
      lead:
        lang === "ru"
          ? "Французская эстетика грабителя, золотые акценты и динамичные бонусные вращения. Протестируйте демо режим или переходите к реальным ставкам в проверенном онлайн казино."
          : lang === "en"
            ? "Parisian heist style, gold-accent action, and explosive bonus spins. Try demo mode or move to real stakes at a licensed online casino."
            : "Estética de atraco parisino, oro y bonus eléctricos. Prueba la demo o juega con dinero real en un casino online seguro.",
      stats,
      image: "assets/images/hero-le-bandit.png",
      imageAlt:
        lang === "ru"
          ? "Слот Le Bandit — премиум визуал казино"
          : lang === "en"
            ? "Le Bandit slot premium casino visuals"
            : "Tragamonedas Le Bandit estilo casino premium",
      demoHref,
    };
  }
  const meta = metaFor(slug, lang);
  return {
    h1: meta.title.split("|")[0].trim(),
    lead: meta.description,
    demoHref,
  };
}

function writePage(lang, def) {
  const { segments, slug, showHero } = def;
  const fromFileDir = fileDirForLang(lang, segments);
  const depth = fromFileDir
    ? fromFileDir.split(/[/\\]/).filter(Boolean).length
    : 0;
  const meta = metaFor(slug, lang);
  const body = readBody(slug, lang);
  const articleHtml = `<div class="section"><article class="prose">${body}</article></div>`;

  const namesForBc = (() => {
    if (!segments.length) return [];
    const ru = {
      demo: "Демо",
      play: "Играть",
      review: "Обзор",
      download: "Скачать",
      "how-to-win": "Как выиграть",
      strategy: "Стратегия",
      "bonus-buy": "Bonus Buy",
      payments: "Платежи",
      android: "Android",
      iphone: "iPhone",
      pc: "ПК",
      apk: "APK",
      faq: "FAQ",
      blog: "Блог",
      terms: "Условия",
      privacy: "Конфиденциальность",
      visa: "Visa",
      mastercard: "Mastercard",
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      qiwi: "QIWI",
      usdt: "USDT",
      tron: "Tron",
      skrill: "Skrill",
      neteller: "Neteller",
      "apple-pay": "Apple Pay",
      "le-bandit-demo-v-rublyah": "Демо в рублях",
      "kak-vyigrat-v-le-bandit": "Как выиграть",
      "luchshie-simvoly-le-bandit": "Символы",
      "hacksaw-gaming-sloty": "Hacksaw слоты",
    };
    const en = {
      demo: "Demo",
      play: "Play",
      review: "Review",
      download: "Download",
      "how-to-win": "How to win",
      strategy: "Strategy",
      "bonus-buy": "Bonus Buy",
      payments: "Payments",
      android: "Android",
      iphone: "iPhone",
      pc: "PC",
      apk: "APK",
      faq: "FAQ",
      blog: "Blog",
      terms: "Terms",
      privacy: "Privacy",
      visa: "Visa",
      mastercard: "Mastercard",
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      qiwi: "QIWI",
      usdt: "USDT",
      tron: "Tron",
      skrill: "Skrill",
      neteller: "Neteller",
      "apple-pay": "Apple Pay",
      "le-bandit-demo-v-rublyah": "Demo in rubles",
      "kak-vyigrat-v-le-bandit": "How to win",
      "luchshie-simvoly-le-bandit": "Best symbols",
      "hacksaw-gaming-sloty": "Hacksaw slots",
    };
    const es = {
      demo: "Demo",
      play: "Jugar",
      review: "Reseña",
      download: "Descargar",
      "how-to-win": "Cómo ganar",
      strategy: "Estrategia",
      "bonus-buy": "Bonus Buy",
      payments: "Pagos",
      android: "Android",
      iphone: "iPhone",
      pc: "PC",
      apk: "APK",
      faq: "FAQ",
      blog: "Blog",
      terms: "Términos",
      privacy: "Privacidad",
      visa: "Visa",
      mastercard: "Mastercard",
      bitcoin: "Bitcoin",
      ethereum: "Ethereum",
      qiwi: "QIWI",
      usdt: "USDT",
      tron: "Tron",
      skrill: "Skrill",
      neteller: "Neteller",
      "apple-pay": "Apple Pay",
      "le-bandit-demo-v-rublyah": "Demo en rublos",
      "kak-vyigrat-v-le-bandit": "Cómo ganar",
      "luchshie-simvoly-le-bandit": "Símbolos",
      "hacksaw-gaming-sloty": "Slots Hacksaw",
    };
    const dict = lang === "ru" ? ru : lang === "en" ? en : es;
    return segments.map((s) => dict[s] || s);
  })();

  const breadcrumbs =
    segments.length > 0
      ? (() => {
          const homeHref = relHref(fromFileDir, distPathForLang(lang, []));
          const bc = [{ name: "", href: homeHref }];
          for (let i = 0; i < segments.length; i++) {
            const part = segments.slice(0, i + 1);
            const href = relHref(fromFileDir, distPathForLang(lang, part));
            bc.push({ name: namesForBc[i], href });
          }
          return bc;
        })()
      : null;

  const bcLd =
    segments.length > 0 ? breadcrumbJsonLd(lang, segments, namesForBc) : null;

  const pool = internalLinkPool(lang, fromFileDir);
  const internalTitle =
    lang === "ru"
      ? "Полезные разделы о Le Bandit"
      : lang === "en"
        ? "Helpful Le Bandit guides"
        : "Guías útiles de Le Bandit";

  const html = renderPage({
    lang,
    depth,
    title: meta.title,
    description: meta.description,
    canonicalPath: canonicalForLang(lang, segments),
    ogImage: `${SITE}/assets/images/og-le-bandit.png`,
    hero: heroFor(slug, lang, fromFileDir, segments),
    articleHtml,
    breadcrumbs,
    breadcrumbJsonLd: bcLd,
    faqs: slug === "faq" ? FAQ_PAGE[lang] : defaultFaqs(lang),
    reviews: defaultReviews(lang),
    showHero,
    internalLinks: {
      title: internalTitle,
      items: pool,
    },
    navItemsHtml: navHtml(lang, fromFileDir, segments),
    langSwitchHtml: langSwitch(lang, fromFileDir, segments),
    brandHref: relHref(fromFileDir, distPathForLang(lang, [])),
    termsHref: relHref(fromFileDir, distPathForLang(lang, ["terms"])),
    privacyHref: relHref(fromFileDir, distPathForLang(lang, ["privacy"])),
  });

  const outDir = path.join(DIST, fromFileDir || ".");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
}

const FAQ_PAGE = {
  ru: [
    {
      q: "Как запустить Le Bandit демо в рублях?",
      a: "Выберите оператора с демо режимом, откройте слот и переключите валюту интерфейса, если казино это поддерживает. Демо использует учебные кредиты и не требует депозита.",
    },
    {
      q: "Что даёт символ wild в Le Bandit?",
      a: "Wild помогает собирать комбинации на барабанах, подменяя другие символы согласно правилам таблицы выплат. Точные правила смотрите внутри игры.",
    },
    {
      q: "Насколько высокий RTP?",
      a: "У Hacksaw Gaming традиционно конкурентный RTP, но итоговый процент может отличаться в зависимости от юрисдикции и настроек оператора.",
    },
    {
      q: "Есть ли Bonus Buy?",
      a: "Если функция доступна в вашем регионе, Bonus Buy позволяет сразу перейти к бонусной игре за фиксированную стоимость спина. Проверяйте локальные ограничения.",
    },
    {
      q: "Можно ли играть на Android и iPhone?",
      a: "Да, слот оптимизирован под мобильные браузеры. Для стабильности используйте современный Chrome или Safari и стабильное соединение.",
    },
  ],
  en: [
    {
      q: "How do I start the Le Bandit demo?",
      a: "Open the slot at a licensed operator that offers demo play. You can practice spins with play credits without a deposit.",
    },
    {
      q: "What does wild do in Le Bandit?",
      a: "Wild symbols help complete winning lines according to the paytable. Always read the in-game rules for exact behavior.",
    },
    {
      q: "Is the RTP high?",
      a: "Hacksaw Gaming titles are known for competitive RTP settings, but the exact number can vary by market and operator configuration.",
    },
    {
      q: "Is Bonus Buy available?",
      a: "Where legally allowed, Bonus Buy can jump straight into the bonus for a fixed price. Availability depends on your region.",
    },
    {
      q: "Does it work on phones?",
      a: "Yes — play in a modern mobile browser on Android or iPhone with a stable connection.",
    },
  ],
  es: [
    {
      q: "¿Cómo inicio la demo de Le Bandit?",
      a: "Abre el juego en un operador con licencia que ofrezca demo y practica con créditos de prueba sin depósito.",
    },
    {
      q: "¿Qué hace el wild?",
      a: "El wild ayuda a completar líneas según la tabla de pagos. Lee las reglas dentro del juego.",
    },
    {
      q: "¿Es alto el RTP?",
      a: "Hacksaw Gaming suele ofrecer RTP competitivo, pero el valor exacto puede variar por mercado y operador.",
    },
    {
      q: "¿Hay Bonus Buy?",
      a: "Donde sea legal, puedes comprar el bonus si el operador lo permite en tu región.",
    },
    {
      q: "¿Funciona en móvil?",
      a: "Sí, usa un navegador moderno y buena conexión en Android o iPhone.",
    },
  ],
};

function sitemapUrls() {
  const urls = [];
  for (const def of PAGE_DEFS) {
    for (const lang of ["ru", "en", "es"]) {
      const loc = `${SITE}${canonicalForLang(lang, def.segments)}`;
      const alts = ["ru", "en", "es"].map((l) => ({
        lang: l,
        href: `${SITE}${canonicalForLang(l, def.segments)}`,
      }));
      urls.push({ loc, alts, segments: def.segments });
    }
  }
  return urls;
}

function writeSitemap() {
  const urls = sitemapUrls();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
  for (const u of urls) {
    xml += `  <url>\n    <loc>${u.loc}</loc>\n`;
    for (const a of u.alts) {
      xml += `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${canonicalForLang("ru", u.segments)}" />\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml, "utf8");
}

function writeRobots() {
  const txt = `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), txt, "utf8");
}

function copyPublicToDist() {
  const pub = path.join(ROOT, "public");
  if (!fs.existsSync(pub)) return;
  for (const name of fs.readdirSync(pub)) {
    const src = path.join(pub, name);
    const dest = path.join(DIST, name);
    if (fs.statSync(src).isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function main() {
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));
  copyPublicToDist();

  for (const def of PAGE_DEFS) {
    for (const lang of ["ru", "en", "es"]) {
      writePage(lang, def);
    }
  }
  writeSitemap();
  writeRobots();
  console.log("Built", PAGE_DEFS.length * 3, "pages into dist/");
}

main();
