const SITE = "https://le-bandit-game.vercel.app";
/** Same token as public/yandex_*.html — meta works when the static file is missing on CDN. */
const YANDEX_VERIFICATION = "a5c3709972c5a32c";
const PLAY_URL =
  "https://h0xhaw0za1kg7e.xyz/click/6979c7c96bcc6364c87500ce/7/16899/subaccount";

const LANGS = ["ru", "en", "es"];

const UI = {
  ru: {
    play: "Играть сейчас",
    playSticky: "ИГРАТЬ — Le Bandit",
    nav: [
      ["Главная", ""],
      ["Демо", "demo"],
      ["Играть", "play"],
      ["Обзор", "review"],
      ["Скачать", "download"],
      ["Как выиграть", "how-to-win"],
      ["Стратегия", "strategy"],
      ["Bonus Buy", "bonus-buy"],
      ["Платежи", "payments"],
      ["Android", "android"],
      ["iPhone", "iphone"],
      ["ПК", "pc"],
      ["APK", "apk"],
      ["FAQ", "faq"],
      ["Блог", "blog"],
    ],
    footerTerms: "Условия",
    footerPrivacy: "Конфиденциальность",
    footer18: "18+ Только для совершеннолетних. Играйте ответственно.",
    footerText:
      "Информационный ресурс о слоте Le Bandit от Hacksaw Gaming. Азартные игры связаны с риском. Не играйте на деньги, которые нельзя потерять.",
    skip: "К содержанию",
  },
  en: {
    play: "Play now",
    playSticky: "PLAY — Le Bandit",
    nav: [
      ["Home", ""],
      ["Demo", "demo"],
      ["Play", "play"],
      ["Review", "review"],
      ["Download", "download"],
      ["How to win", "how-to-win"],
      ["Strategy", "strategy"],
      ["Bonus Buy", "bonus-buy"],
      ["Payments", "payments"],
      ["Android", "android"],
      ["iPhone", "iphone"],
      ["PC", "pc"],
      ["APK", "apk"],
      ["FAQ", "faq"],
      ["Blog", "blog"],
    ],
    footerTerms: "Terms",
    footerPrivacy: "Privacy",
    footer18: "18+ Adults only. Play responsibly.",
    footerText:
      "Informational resource about the Le Bandit slot by Hacksaw Gaming. Gambling involves risk. Do not wager money you cannot afford to lose.",
    skip: "Skip to content",
  },
  es: {
    play: "Jugar ahora",
    playSticky: "JUGAR — Le Bandit",
    nav: [
      ["Inicio", ""],
      ["Demo", "demo"],
      ["Jugar", "play"],
      ["Reseña", "review"],
      ["Descargar", "download"],
      ["Cómo ganar", "how-to-win"],
      ["Estrategia", "strategy"],
      ["Bonus Buy", "bonus-buy"],
      ["Pagos", "payments"],
      ["Android", "android"],
      ["iPhone", "iphone"],
      ["PC", "pc"],
      ["APK", "apk"],
      ["FAQ", "faq"],
      ["Blog", "blog"],
    ],
    footerTerms: "Términos",
    footerPrivacy: "Privacidad",
    footer18: "18+ Solo adultos. Juega con responsabilidad.",
    footerText:
      "Recurso informativo sobre la tragamonedas Le Bandit de Hacksaw Gaming. El juego implica riesgos. No apuestes dinero que no puedas perder.",
    skip: "Ir al contenido",
  },
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function prefixForDepth(depth) {
  return depth > 0 ? "../".repeat(depth) : "";
}

function hreflangTags(canonicalPath) {
  const clean = canonicalPath.replace(/^\//, "").replace(/\/$/, "");
  const core = clean.replace(/^(en|es)\//, "");
  const lines = [];
  for (const l of LANGS) {
    const p =
      l === "ru"
        ? core
          ? `/${core}/`
          : "/"
        : core
          ? `/${l}/${core}/`
          : `/${l}/`;
    lines.push(`<link rel="alternate" hreflang="${l}" href="${SITE}${p}" />`);
  }
  lines.push(
    `<link rel="alternate" hreflang="x-default" href="${SITE}/${core ? `${core}/` : ""}" />`
  );
  return lines.join("\n    ");
}

function renderPage(opts) {
  const {
    lang,
    depth,
    title,
    description,
    canonicalPath,
    ogImage,
    hero,
    articleHtml,
    breadcrumbs,
    faqs,
    reviews,
    showHero,
    internalLinks,
    navItemsHtml,
    langSwitchHtml,
    brandHref,
    termsHref,
    privacyHref,
  } = opts;

  const pre = prefixForDepth(depth);
  const u = UI[lang];
  const canonical = `${SITE}${canonicalPath}`;
  const og = ogImage || `${SITE}/assets/images/og-le-bandit.jpg`;

  const bcHtml =
    breadcrumbs && breadcrumbs.length
      ? (() => {
          const firstLabel =
            lang === "ru" ? "Главная" : lang === "en" ? "Home" : "Inicio";
          const home = breadcrumbs[0];
          let h = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${home.href}">${escapeHtml(
            firstLabel
          )}</a>`;
          for (let i = 1; i < breadcrumbs.length; i++) {
            const b = breadcrumbs[i];
            const isLast = i === breadcrumbs.length - 1;
            h += " / ";
            if (isLast) h += `<span>${escapeHtml(b.name)}</span>`;
            else h += `<a href="${b.href}">${escapeHtml(b.name)}</a>`;
          }
          h += "</nav>";
          return h;
        })()
      : "";

  const schemaBlocks = [];
  if (opts.breadcrumbJsonLd) {
    schemaBlocks.push(opts.breadcrumbJsonLd);
  }
  if (faqs && faqs.length) {
    schemaBlocks.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        null,
        0
      )
    );
  }
  if (reviews && reviews.length) {
    const avg =
      reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);
    const items = reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.body,
      itemReviewed: {
        "@type": "VideoGame",
        name: "Le Bandit Slot",
        gamePlatform: "Online Casino",
        applicationCategory: "CasinoSlot",
      },
    }));
    schemaBlocks.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Le Bandit Slot (Hacksaw Gaming)",
          description:
            lang === "ru"
              ? "Онлайн-слот Le Bandit с бонус-раундами и высоким RTP."
              : lang === "en"
                ? "Le Bandit online slot with bonus rounds and high RTP."
                : "Tragamonedas Le Bandit en línea con rondas de bonificación y RTP alto.",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
          review: items,
        },
        null,
        0
      )
    );
  }

  const heroSection =
    showHero && hero
      ? `<header class="hero">
  <div class="hero-grid">
    <div>
      <div class="hero-badge">${hero.badge}</div>
      <h1>${hero.h1}</h1>
      <p class="hero-lead">${hero.lead}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="${PLAY_URL}" rel="nofollow sponsored noopener noreferrer" target="_blank">${escapeHtml(
          u.play
        )}</a>
        <a class="btn btn-ghost" href="${hero.demoHref}">${escapeHtml(
          lang === "ru" ? "Демо" : lang === "en" ? "Demo" : "Demo"
        )}</a>
      </div>
      <div class="hero-stats">${hero.stats || ""}</div>
    </div>
    <div class="hero-visual">
      <img class="lazy" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%2312101a' width='16' height='9'/%3E%3C/svg%3E" data-src="${pre}${hero.image}" alt="${escapeHtml(
        hero.imageAlt
      )}" width="960" height="720" loading="lazy" />
    </div>
  </div>
</header>`
      : `<header class="hero">
  <div class="hero-grid">
    <div>
      <h1>${hero?.h1 || ""}</h1>
      <p class="hero-lead">${hero?.lead || ""}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="${PLAY_URL}" rel="nofollow sponsored noopener noreferrer" target="_blank">${escapeHtml(
          u.play
        )}</a>
      </div>
    </div>
  </div>
</header>`;

  const internalBlock =
    internalLinks &&
    internalLinks.items &&
    internalLinks.items.length
      ? `<section class="section"><div class="section-head"><h2>${escapeHtml(
          internalLinks.title
        )}</h2></div><div class="link-cluster">${internalLinks.items
          .map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`)
          .join("")}</div></section>`
      : "";

  const ldJson =
    schemaBlocks.length > 0
      ? schemaBlocks.map((s) => `<script type="application/ld+json">${s}</script>`).join("\n")
      : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="yandex-verification" content="${escapeHtml(YANDEX_VERIFICATION)}" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />
  ${hreflangTags(canonicalPath)}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${og}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${og}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    body{margin:0;font-family:system-ui,sans-serif;background:#07060b;color:#f4f1ea}
  </style>
  <link rel="stylesheet" href="${pre}assets/css/main.css" />
  ${ldJson}
</head>
<body>
  <a class="skip-link" href="#main">${escapeHtml(u.skip)}</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="${brandHref}">
        <span class="brand-mark">LB</span>
        <span class="brand-text">Le <span>Bandit</span></span>
      </a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-menu">☰</button>
      <nav class="main-nav" id="site-menu" aria-label="Main">
        <ul>
          ${navItemsHtml}
        </ul>
      </nav>
      <div class="header-actions">
        <div class="lang-switch">${langSwitchHtml}</div>
        <a class="btn btn-primary hide-mobile" href="${PLAY_URL}" rel="nofollow sponsored noopener noreferrer" target="_blank">${escapeHtml(
          u.play
        )}</a>
      </div>
    </div>
  </header>
  ${bcHtml}
  <main id="main">
    ${heroSection}
    ${articleHtml}
    ${internalBlock}
  </main>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-links">
        <a href="${termsHref}">${escapeHtml(u.footerTerms)}</a>
        <a href="${privacyHref}">${escapeHtml(u.footerPrivacy)}</a>
      </div>
      <p class="footer-disclaimer"><strong>${escapeHtml(u.footer18)}</strong> ${escapeHtml(
        u.footerText
      )}</p>
    </div>
  </footer>
  <div class="sticky-cta" role="region" aria-label="Play">
    <div class="sticky-cta-inner">
      <a class="btn btn-primary" href="${PLAY_URL}" rel="nofollow sponsored noopener noreferrer" target="_blank">${escapeHtml(
        u.playSticky
      )}</a>
    </div>
  </div>
  <script src="${pre}assets/js/main.js" defer></script>
</body>
</html>`;
}

export { SITE, PLAY_URL, LANGS, UI, escapeHtml, prefixForDepth, hreflangTags, renderPage };
