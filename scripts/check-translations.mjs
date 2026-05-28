import fs from "node:fs";

const langs = ["ro", "en", "cs", "pl"];
const data = Object.fromEntries(
  langs.map((l) => [l, JSON.parse(fs.readFileSync(`messages/${l}.json`, "utf8"))]),
);

function leafKeys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...leafKeys(v, p));
    else out.push(p);
  }
  return out;
}

const sets = Object.fromEntries(langs.map((l) => [l, new Set(leafKeys(data[l]))]));
console.log("Key counts:", langs.map((l) => `${l}=${sets[l].size}`).join(" "));

const ref = sets.ro;
let issues = 0;
for (const lang of langs) {
  if (lang === "ro") continue;
  const missing = [...ref].filter((k) => !sets[lang].has(k));
  const extra = [...sets[lang]].filter((k) => !ref.has(k));
  if (missing.length) {
    console.log(`MISSING in ${lang} (vs ro):`, missing);
    issues += missing.length;
  }
  if (extra.length) {
    console.log(`EXTRA in ${lang}:`, extra);
    issues += extra.length;
  }
}
console.log(issues === 0 ? "✓ All locales in sync" : `✗ Total mismatches: ${issues}`);
process.exit(issues === 0 ? 0 : 1);
