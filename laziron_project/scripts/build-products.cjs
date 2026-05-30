const fs = require("fs");
const path = require("path");

const DIR = path.join("public", "images", "descrieri_html");
const OUT = path.join("src", "data", "products.json");

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.toLowerCase().endsWith(".html"))
  .sort();

function metaLine(comment, label) {
  const m = comment.match(new RegExp(label + "\\s*:?\\s*(.+)"));
  return m ? m[1].trim() : "";
}

function decode(s) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function categorize(text) {
  const t = text.toLowerCase();
  if (/sudur|sudare/.test(t)) return "welding";
  if (/curăț|curat/.test(t)) return "cleaning";
  if (/îndoit|indoit|abkant|presă|presa/.test(t)) return "bending";
  if (/(țeavă|teava|țevi|tevi|tub)/.test(t) && /(tablă|tabla)/.test(t)) return "sheet-tube";
  if (/(țeavă|teava|țevi|tevi|tub)/.test(t)) return "tube";
  return "sheet";
}

function highlightsFromTable(raw) {
  const tbody = raw.match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!tbody) return [];
  const rows = tbody[1].match(/<tr>[\s\S]*?<\/tr>/gi) || [];
  const out = [];
  for (const row of rows) {
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    if (cells.length < 2) continue;
    const label = decode(cells[0]);
    const value = decode(cells[1]);
    if (label && value) out.push({ label, value });
    if (out.length >= 8) break;
  }
  return out;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Preserve the existing first product (laz-001) untouched, just ensure category.
const existing = JSON.parse(fs.readFileSync(OUT, "utf8"));
const laz001 = existing.products.find((p) => p.id === "laz-001");
laz001.category = "sheet";
if (laz001.order == null) laz001.order = 1;

const products = [laz001];

let order = 1;
for (const f of files) {
  order += 1;
  const raw = fs.readFileSync(path.join(DIR, f), "utf8");
  const id = (f.match(/^(laz-\d+)/) || [])[1];
  const series = ((f.match(/laz-\d+-gm-(.+?)-series/i) || [])[1] || "").toUpperCase();
  const comment = (raw.match(/<!--([\s\S]*?)-->/) || [, ""])[1];
  const seoTitle = metaLine(comment, "SEO Title").split("|")[0].trim();
  const focus = metaLine(comment, "Focus Keyword");
  const metaDesc = metaLine(comment, "Meta Description");

  const name = focus
    ? `LAZIRON ${series} — ${cap(focus)}`
    : seoTitle || `LAZIRON ${series}`;
  const tagline = metaDesc;
  const highlights = highlightsFromTable(raw);
  const category = categorize(`${seoTitle} ${focus} ${series}`);
  const descriptionHtml = raw.replace(/^\s*<!--[\s\S]*?-->\s*/, "").trim();

  products.push({
    id,
    series,
    category,
    order,
    images: [`${id}-1.webp`, `${id}-2.webp`],
    translations: {
      ro: { name, tagline, highlights, applications: [], descriptionHtml },
    },
  });
}

// Feature one flagship per category for the homepage carousel.
const FEATURED = new Set([
  "laz-001",
  "laz-014",
  "laz-018",
  "laz-020",
  "laz-024",
  "laz-028",
]);
for (const p of products) {
  if (FEATURED.has(p.id)) p.featured = true;
}

fs.writeFileSync(OUT, JSON.stringify({ products }, null, 2) + "\n", "utf8");

// Summary
const byCat = {};
for (const p of products) byCat[p.category] = (byCat[p.category] || 0) + 1;
console.log(`Wrote ${products.length} products to ${OUT}`);
console.log("By category:", byCat);
for (const p of products.slice(0, 3)) {
  console.log(`- ${p.id} [${p.category}] "${p.translations.ro.name}" — ${p.translations.ro.highlights.length} specs`);
}
