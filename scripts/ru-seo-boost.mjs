import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SITE = "https://le-bandit-game.vercel.app";
const UPDATED = "2026-09-20";

const pages = {
  "/": {
    title: "Le Bandit (Ле Бандит) слот — играть онлайн, демо бесплатно | Hacksaw Gaming",
    description: "Le Bandit (Ле Бандит) — слот Hacksaw Gaming: демо и игра онлайн, RTP 96,34%, волатильность 3/5, Cluster Pays, Golden Squares, бонусы и max win 10 000x.",
    h1: 'Le Bandit (Ле Бандит) слот — <span class="accent">играть онлайн</span> и демо бесплатно'
  },
  "/demo/": {
    title: "Le Bandit демо — играть бесплатно в слот Ле Бандит онлайн",
    description: "Le Bandit demo: бесплатный режим слота Ле Бандит от Hacksaw Gaming. Изучите 6×5, Cluster Pays, Golden Squares, Rainbow, бонусы и RTP без реальных ставок.",
    h1: "Le Bandit демо — играть бесплатно в слот Ле Бандит"
  },
  "/play/": {
    title: "Le Bandit играть онлайн — слот Ле Бандит на реальные деньги",
    description: "Как играть в Le Bandit онлайн: слот Ле Бандит от Hacksaw Gaming, RTP до 96,34%, волатильность 3/5, бонусные режимы, лимиты и ответственная игра.",
    h1: "Le Bandit играть онлайн — слот Ле Бандит"
  },
  "/review/": {
    title: "Le Bandit слот — обзор, RTP 96,34%, бонусы и max win 10 000x",
    description: "Обзор Le Bandit (Ле Бандит): правила, 6×5, Cluster Pays, Golden Squares, Super Cascades, RTP 96,34%, волатильность 3/5 и максимум 10 000x.",
    h1: "Обзор слота Le Bandit (Ле Бандит): RTP, механики и бонусы"
  },
  "/bonus-buy/": {
    title: "Le Bandit Bonus Buy — бонусы слота Ле Бандит и фриспины",
    description: "Bonus Buy в Le Bandit: режимы фриспинов, Golden Squares, Rainbow и особенности покупки бонуса в слоте Ле Бандит от Hacksaw Gaming.",
    h1: "Le Bandit Bonus Buy — бонусы и фриспины Ле Бандит"
  },
  "/how-to-win/": {
    title: "Le Bandit как играть — механики, ставки и правила слота Ле Бандит",
    description: "Как устроен Le Bandit: Cluster Pays, Super Cascades, Golden Squares, бонусные режимы, RTP и управление ставками. Без обещаний гарантированного выигрыша.",
    h1: "Как играть в Le Bandit: правила и механики слота Ле Бандит"
  },
  "/android/": {
    title: "Le Bandit на Android — играть в слот Ле Бандит с телефона",
    description: "Le Bandit на Android: как открыть слот Ле Бандит с телефона, демо, браузерный запуск, безопасность APK и особенности мобильной версии Hacksaw Gaming.",
    h1: "Le Bandit на Android — слот Ле Бандит на телефоне"
  },
  "/iphone/": {
    title: "Le Bandit на iPhone — играть в слот Ле Бандит на iOS",
    description: "Le Bandit на iPhone и iOS: мобильный запуск слота Ле Бандит, демо, браузер, безопасность и особенности игры Hacksaw Gaming на смартфоне.",
    h1: "Le Bandit на iPhone — слот Ле Бандит на iOS"
  },
  "/pc/": {
    title: "Le Bandit на ПК — слот Ле Бандит онлайн на компьютере",
    description: "Le Bandit на ПК: играть в слот Ле Бандит через браузер, демо режим, требования к компьютеру, безопасность и удобство версии Hacksaw Gaming.",
    h1: "Le Bandit на ПК — слот Ле Бандит на компьютере"
  },
  "/download/": {
    title: "Скачать Le Bandit — слот Ле Бандит на Android, iPhone и ПК",
    description: "Как скачать и запустить Le Bandit: слот Ле Бандит на Android, iPhone и ПК, браузерная версия, безопасность установки и мобильная игра Hacksaw Gaming.",
    h1: "Скачать Le Bandit — слот Ле Бандит на телефон и ПК"
  },
  "/strategy/": {
    title: "Стратегия Le Bandit — как играть в Ле Бандит и управлять ставками",
    description: "Стратегия Le Bandit без мифов: RTP, волатильность, размер ставки, длительность сессии, демо и Bonus Buy. Слот Ле Бандит от Hacksaw Gaming.",
    h1: "Стратегия Le Bandit — как играть в слот Ле Бандит"
  },
  "/apk/": {
    title: "Le Bandit APK — скачать слот Ле Бандит на Android безопасно",
    description: "Le Bandit APK и Android: где безопасно запускать слот Ле Бандит, почему опасны сторонние APK и чем браузерная версия отличается от установки.",
    h1: "Le Bandit APK — слот Ле Бандит на Android"
  },
  "/faq/": {
    title: "Le Bandit FAQ — RTP, демо, бонусы и вопросы про слот Ле Бандит",
    description: "Ответы на вопросы про Le Bandit: RTP 96,34%, волатильность 3/5, max win 10 000x, демо, Golden Squares, Bonus Buy и мобильная версия.",
    h1: "Le Bandit FAQ — вопросы и ответы про слот Ле Бандит"
  },
  "/payments/": {
    title: "Le Bandit казино — платежи и способы пополнения для слота",
    description: "Платежи для Le Bandit в онлайн-казино: карты, электронные кошельки и криптовалюта, комиссии, лимиты и безопасность перед игрой в слот Ле Бандит.",
    h1: "Le Bandit казино — платежи и пополнение для слота"
  },
  "/blog/": {
    title: "Le Bandit блог — гайды про слот Ле Бандит, демо и Hacksaw Gaming",
    description: "Блог про Le Bandit: демо, механики, символы, RTP, бонусы и другие слоты Hacksaw Gaming. Русские гайды по игровому автомату Ле Бандит.",
    h1: "Le Bandit блог — гайды про слот Ле Бандит"
  },
  "/blog/le-bandit-demo-v-rublyah/": {
    title: "Le Bandit демо в рублях — играть бесплатно в Ле Бандит",
    description: "Le Bandit демо в рублях: как работает отображение валюты, бесплатный режим и что можно проверить перед реальными ставками в слоте Ле Бандит.",
    h1: "Le Bandit демо в рублях — бесплатный режим Ле Бандит"
  },
  "/blog/kak-vyigrat-v-le-bandit/": {
    title: "Как выиграть в Le Bandit — RTP, риск и механики слота Ле Бандит",
    description: "Разбор запроса «как выиграть в Le Bandit»: что реально означают RTP и волатильность, как работают бонусы и почему гарантированной схемы выигрыша нет.",
    h1: "Как выиграть в Le Bandit: что реально влияет на игру"
  },
  "/blog/luchshie-simvoly-le-bandit/": {
    title: "Символы Le Bandit — Golden Squares, Rainbow, Coins и Pot of Gold",
    description: "Символы Le Bandit: Golden Squares, Rainbow, Bronze/Silver/Gold Coins, Four-Leaf Clover, Pot of Gold и их роль в механике слота Ле Бандит.",
    h1: "Символы Le Bandit — Golden Squares, Rainbow и монеты"
  },
  "/blog/hacksaw-gaming-sloty/": {
    title: "Hacksaw Gaming слоты — Le Bandit и механики провайдера",
    description: "Hacksaw Gaming и Le Bandit: особенности слотов провайдера, мобильный формат, бонусные механики и что сравнивать перед выбором игры.",
    h1: "Hacksaw Gaming слоты — Le Bandit и другие игры провайдера"
  }
};

function fileFor(route) {
  if (route === "/") return path.join(DIST, "index.html");
  return path.join(DIST, route.replace(/^\//, ""), "index.html");
}

function escapeRegex(s) {
  return String(s).replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
}

function replaceTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + value + "</title>");
}

function replaceMeta(html, key, value, attr = "name") {
  const re = new RegExp('<meta\\s+' + attr + '=["\\\']' + escapeRegex(key) + '["\\\'][^>]*>', "i");
  const tag = '<meta ' + attr + '="' + key + '" content="' + value.replace(/"/g, "&quot;") + '" />';
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", "  " + tag + "\n</head>");
}

function replaceH1(html, value) {
  return html.replace(/<h1>[\s\S]*?<\/h1>/i, "<h1>" + value + "</h1>");
}

function addHeadExtras(html, route) {
  if (html.includes("RU_SEO_BOOST_2026")) return html;
  const canonical = SITE + route;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonical + "#webpage",
        url: canonical,
        name: pages[route].title,
        description: pages[route].description,
        inLanguage: "ru-RU",
        isPartOf: { "@id": SITE + "/#website" },
        about: { "@id": SITE + "/#le-bandit" },
        dateModified: UPDATED
      },
      {
        "@type": "WebSite",
        "@id": SITE + "/#website",
        url: SITE + "/",
        name: "Le Bandit Game",
        inLanguage: ["ru-RU", "en", "es"]
      },
      {
        "@type": "VideoGame",
        "@id": SITE + "/#le-bandit",
        name: "Le Bandit",
        alternateName: ["Ле Бандит", "Le Bandit Slot"],
        url: SITE + "/",
        applicationCategory: "Game",
        gamePlatform: ["Web browser", "Android", "iOS", "Windows", "macOS"],
        operatingSystem: "Web browser",
        author: { "@type": "Organization", name: "Hacksaw Gaming", url: "https://www.hacksawgaming.com/" },
        publisher: { "@type": "Organization", name: "Hacksaw Gaming", url: "https://www.hacksawgaming.com/" },
        sameAs: ["https://www.hacksawgaming.com/games/le-bandit"]
      }
    ]
  };
  const extra = [
    "  <!-- RU_SEO_BOOST_2026 -->",
    '  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />',
    '  <meta property="og:locale" content="ru_RU" />',
    '  <meta name="language" content="Russian" />',
    '  <script type="application/ld+json">' + JSON.stringify(schema) + "</script>"
  ].join("\n");
  return html.replace("</head>", extra + "\n</head>");
}

const homeExtra = `
<section class="section" aria-labelledby="le-bandit-russian-guide">
  <article class="prose">
    <p><small>Обновлено: 20 сентября 2026 года. Характеристики сверены с официальной страницей Hacksaw Gaming.</small></p>
    <h2 id="le-bandit-russian-guide">Le Bandit (Ле Бандит): полный разбор слота на русском</h2>
    <p><strong>Le Bandit</strong>, или «<strong>Ле Бандит</strong>», — онлайн-слот Hacksaw Gaming с полем 6×5, системой Cluster Pays, каскадами Super Cascades и механикой Golden Squares. Если вы ищете «Le Bandit слот», «Ле Бандит слот», «Le Bandit играть», «Le Bandit демо» или «Ле Бандит играть бесплатно», на этой странице собраны основные характеристики игры и ссылки на отдельные подробные разделы. По данным разработчика, максимальный выигрыш достигает 10 000× ставки, волатильность указана как 3/5, а доступные конфигурации RTP — 96,34%, 94,23%, 92,17% и 88,36%. Конкретный RTP необходимо проверять в справке той версии игры, которую предоставляет оператор.</p>

    <h2>Характеристики Le Bandit: RTP, волатильность и max win</h2>
    <div style="overflow-x:auto">
      <table>
        <tbody>
          <tr><th>Провайдер</th><td>Hacksaw Gaming</td></tr>
          <tr><th>Название</th><td>Le Bandit / Ле Бандит</td></tr>
          <tr><th>Поле</th><td>6 барабанов × 5 рядов</td></tr>
          <tr><th>Тип выплат</th><td>Cluster Pays</td></tr>
          <tr><th>Волатильность</th><td>3/5 по данным разработчика</td></tr>
          <tr><th>RTP</th><td>96,34% / 94,23% / 92,17% / 88,36%</td></tr>
          <tr><th>Максимальный выигрыш</th><td>до 10 000× ставки</td></tr>
          <tr><th>Ключевые функции</th><td>Super Cascades, Golden Squares, Rainbow, Coins, Four-Leaf Clover, Pot of Gold, Free Spins, Bonus Buy</td></tr>
        </tbody>
      </table>
    </div>
    <p>Эти цифры полезны для сравнения, но не прогнозируют конкретный результат сессии. RTP — долгосрочная математическая характеристика, а не обещание возврата на короткой дистанции. Отдельный <a href="/review/">обзор Le Bandit</a> подробнее разбирает механику и характеристики слота.</p>

    <h2>Как работает слот Ле Бандит</h2>
    <p>В Le Bandit выигрышные комбинации формируются кластерами. После выигрыша участвующие символы исчезают, а на освободившиеся позиции падают новые — так запускаются Super Cascades. Позиции выигрышных символов могут становиться Golden Squares. Если в том же спине появляется Rainbow, золотые клетки активируются и получают специальные значения или символы. За счёт этого один каскад может развиваться в несколько последовательных событий.</p>
    <p>Официальное описание Hacksaw Gaming указывает несколько типов монет: Bronze Coins имеют значения от 0,2× до 4×, Silver Coins — от 5× до 20×, а Gold Coins могут достигать 500×. Four-Leaf Clover умножает соседние клетки на значения от 2× до 10×, а Pot of Gold собирает значения видимых монет и других Pot of Gold. Именно взаимодействие Golden Squares, Rainbow, монет, клевера и горшков формирует узнаваемую механику Le Bandit.</p>

    <h2>Бонусы и фриспины Le Bandit</h2>
    <p>У слота есть несколько бонусных сценариев. Luck of the Bandit запускается при трёх FS-символах; Golden Squares могут сохраняться между спинами до активации Rainbow. Четыре FS-символа запускают All That Glitters Is Gold с 12 бесплатными вращениями и сохранением Golden Squares на протяжении бонуса. Пять FS-символов открывают Treasure at the End of the Rainbow: также 12 фриспинов, но Rainbow гарантирован в каждом вращении. Этот верхний бонус, согласно официальному описанию, нельзя купить напрямую.</p>
    <p>Для отдельных режимов доступен Bonus Buy, а FeatureSpins BonusHunt повышает шанс запуска бонуса в обмен на дополнительную стоимость. Если вам нужна именно эта тема, откройте раздел <a href="/bonus-buy/">Le Bandit Bonus Buy</a>. Доступность покупки бонуса зависит от страны и правил оператора.</p>

    <h2>Le Bandit демо: играть бесплатно или сразу на деньги?</h2>
    <p>Для знакомства с интерфейсом логичнее начать с <a href="/demo/">Le Bandit demo</a>. Демо-режим позволяет увидеть каскады, Golden Squares, Rainbow и бонусные события без реальных ставок. Он подходит для изучения правил и управления, но не может показать, каким будет финансовый результат реальной сессии. Случайные события не становятся более предсказуемыми после серии тренировочных спинов.</p>
    <p>Запросы «Ле Бандит демо бесплатно», «Le Bandit играть бесплатно» и «Le Bandit demo online» относятся прежде всего к тестовому режиму. Для игры на реальные деньги действуют правила конкретного оператора, возрастные ограничения и требования законодательства страны пользователя. На сайте также есть отдельная страница <a href="/play/">как играть в Le Bandit онлайн</a> с акцентом на лимиты и ответственную игру.</p>

    <h2>Le Bandit на телефоне и компьютере</h2>
    <p>Hacksaw Gaming проектирует слоты с поддержкой мобильных и настольных устройств. Le Bandit можно открывать через современный браузер на смартфоне или ПК, если игра доступна у выбранного оператора. Подробности вынесены в отдельные материалы: <a href="/android/">Le Bandit на Android</a>, <a href="/iphone/">Le Bandit на iPhone</a> и <a href="/pc/">Le Bandit на ПК</a>. Сторонние APK с обещаниями «взломанного RNG» лучше не устанавливать: они не меняют математику лицензированной игры и могут быть небезопасны.</p>

    <h2>Частые запросы про Le Bandit</h2>
    <p><strong>Le Bandit и Ле Бандит — это одна игра?</strong> Да. «Ле Бандит» — русская транслитерация названия Le Bandit.</p>
    <p><strong>Какой RTP у Le Bandit?</strong> Разработчик указывает несколько конфигураций: 96,34%, 94,23%, 92,17% и 88,36%. Проверяйте значение внутри конкретной версии слота.</p>
    <p><strong>Какая волатильность у Ле Бандит?</strong> На официальной странице Hacksaw Gaming указано 3/5.</p>
    <p><strong>Какой максимальный выигрыш?</strong> До 10 000× ставки.</p>
    <p><strong>Есть ли бесплатная демо-версия?</strong> Демо доступность зависит от площадки, но сам формат используется для тестовой игры без реальных ставок.</p>
    <p><strong>Где проверить официальные характеристики?</strong> На странице <a href="https://www.hacksawgaming.com/games/le-bandit" rel="noopener" target="_blank">Le Bandit на сайте Hacksaw Gaming</a>.</p>

    <h2>Структура сайта под русские запросы</h2>
    <p>Основные пользовательские намерения разделены между страницами: главная раскрывает общий запрос «Le Bandit / Ле Бандит слот», <a href="/demo/">демо</a> — бесплатный режим, <a href="/review/">обзор</a> — характеристики и механику, <a href="/bonus-buy/">Bonus Buy</a> — покупку бонуса, а мобильные страницы — запуск на конкретных устройствах. Такая структура уменьшает каннибализацию запросов и помогает поисковой системе точнее соотнести страницу с намерением пользователя.</p>
  </article>
</section>
`;

for (const [route, meta] of Object.entries(pages)) {
  const file = fileFor(route);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  html = replaceTitle(html, meta.title);
  html = replaceMeta(html, "description", meta.description);
  html = replaceMeta(html, "og:title", meta.title, "property");
  html = replaceMeta(html, "og:description", meta.description, "property");
  html = replaceMeta(html, "twitter:title", meta.title);
  html = replaceMeta(html, "twitter:description", meta.description);
  html = replaceH1(html, meta.h1);
  html = addHeadExtras(html, route);

  if (route === "/" && !html.includes('id="le-bandit-russian-guide"')) {
    html = html.replace("</main>", homeExtra + "\n</main>");
    html = html.replace(
      /<img class="lazy"\s+src="data:image[^"]*"\s+data-src="\/assets\/images\/hero-le-bandit\.png"([^>]*?)loading="lazy"([^>]*?)\/>/i,
      '<img class="hero-seo-img" src="/assets/images/hero-le-bandit.png"$1loading="eager" fetchpriority="high"$2/>'
    );
  }

  fs.writeFileSync(file, html, "utf8");
}

const sitemapPath = path.join(DIST, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, "utf8");
  for (const route of Object.keys(pages)) {
    const loc = SITE + route;
    const escaped = escapeRegex(loc);
    const re = new RegExp("<url><loc>" + escaped + "<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>");
    xml = xml.replace(re, "<url><loc>" + loc + "</loc><lastmod>" + UPDATED + "</lastmod></url>");
  }
  fs.writeFileSync(sitemapPath, xml, "utf8");
}

console.log("Russian SEO boost applied to " + Object.keys(pages).length + " priority pages.");
