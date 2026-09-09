import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://le-bandit-game.vercel.app';

const CORE = [
  '', 'demo', 'play', 'review', 'download', 'how-to-win', 'strategy',
  'bonus-buy', 'payments', 'android', 'iphone', 'pc', 'apk', 'faq', 'blog'
];
const BLOGS = [
  'le-bandit-demo-v-rublyah',
  'kak-vyigrat-v-le-bandit',
  'luchshie-simvoly-le-bandit',
  'hacksaw-gaming-sloty'
];
const LANGS = ['', 'en', 'es'];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

function relUrl(file) {
  const rel = path.relative(DIST, path.dirname(file)).replaceAll(path.sep, '/');
  return rel ? `/${rel}/` : '/';
}

function addNoindex(html) {
  if (/<meta\s+name=["']robots["']/i.test(html)) {
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow">');
  }
  return html.replace('</head>', '  <meta name="robots" content="noindex,follow">\n</head>');
}

const files = walk(DIST);
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/(^|[>\s])undefined(?=<|[\s<])/gi, '$1');
  html = html.replace(/alt=["']undefined["']/gi, 'alt="Le Bandit slot"');
  const url = relUrl(file);
  if (/^\/(en\/|es\/)?payments\/(visa|mastercard|bitcoin|ethereum|qiwi|usdt|tron|skrill|neteller|apple-pay)\/$/.test(url)) {
    html = addNoindex(html);
  }
  fs.writeFileSync(file, html, 'utf8');
}

const urls = [];
for (const lang of LANGS) {
  for (const slug of CORE) {
    const prefix = lang ? `/${lang}` : '';
    urls.push(`${SITE}${prefix}${slug ? `/${slug}` : ''}/`);
  }
  for (const slug of BLOGS) {
    const prefix = lang ? `/${lang}` : '';
    urls.push(`${SITE}${prefix}/blog/${slug}/`);
  }
}

const unique = [...new Set(urls)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  unique.map(u => `  <url><loc>${u}</loc></url>`).join('\n') +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`;
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');

console.log(`SEO post-build: ${files.length} HTML files cleaned; sitemap contains ${unique.length} URLs.`);
