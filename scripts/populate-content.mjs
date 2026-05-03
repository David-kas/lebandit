import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as home from "./content-bodies/home.mjs";
import { corePages } from "./content-bodies/core-pages.mjs";
import { blogPages } from "./content-bodies/blog-pages.mjs";
import { paymentBodies } from "./content-bodies/payments.mjs";
import { legalPages } from "./content-bodies/legal.mjs";
import { boostHtml, wordCountHtml } from "./boost-pool.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "content", "html");

const MIN_WORDS = 1200;

function writeTriple(slug, mod) {
  fs.mkdirSync(OUT, { recursive: true });
  for (const lang of ["ru", "en", "es"]) {
    let html = mod[lang];
    if (!html) throw new Error(`Missing ${lang} for ${slug}`);
    html = html.trim();
    const wc = wordCountHtml(html);
    if (wc < MIN_WORDS) {
      html += boostHtml(lang, slug, MIN_WORDS - wc + 40);
    }
    fs.writeFileSync(path.join(OUT, `${slug}.${lang}.html`), `${html}\n`, "utf8");
  }
}

writeTriple("home", home);

for (const [slug, mod] of Object.entries(corePages)) {
  writeTriple(slug, mod);
}

for (const [slug, mod] of Object.entries(blogPages)) {
  writeTriple(slug, mod);
}

for (const [slug, mod] of Object.entries(paymentBodies)) {
  writeTriple(slug, mod);
}

for (const [slug, mod] of Object.entries(legalPages)) {
  writeTriple(slug, mod);
}

console.log("Wrote content/html/*.html");
