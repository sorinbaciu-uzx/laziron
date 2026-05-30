# CLAUDE.md — starter that builds a multilingual marketing/catalog site from an empty folder

Drop this file into an EMPTY project folder. Claude Code reads it automatically at the start of
every session. It tells Claude to: (A) scaffold a Next.js + React app, (B) ask the user only for
the brand name and what they sell, (C) read the logo to learn the brand, then (D) build a SMALL
working base. After the base, the user drives it: they send photos / example sites and say "I
want the homepage like this, this section like that", and Claude builds each piece on request,
following the conventions locked in below. The user is not technical and never edits files.

> **Golden rule:** the user does not know how to code. Talk to them in plain, everyday language,
> never in technical jargon. Make all technical decisions yourself and never ask them to edit
> files, run commands, or answer technical questions. The only things you ask them for are:
> the brand name, what they sell, the logo, and photos/examples of how they want things to look.
> You own all the code; they own the vision.

---

## ⚠️ FIRST RUN — orient yourself first

Before doing anything, check whether the folder already has a project (look for `package.json`).
There are two cases:

### Case A — a project already exists (`package.json` is present)
Do NOT scaffold and do NOT rebuild what's there. **Analyze the existing project first:**
- read `package.json` (framework + dependencies), the folder tree, `src/app/` routes,
  `src/components/`, `src/i18n/routing.ts` (locales), the `messages/` files, `src/data/`,
  and `globals.css` (theme colors);
- work out the stack, the locales, the brand (name, colors, logo in `public/images/`), and
  which pages/sections already exist vs. are missing;
- fill the **BRAND PROFILE** below from what you find; ask the user ONLY for what you truly
  cannot determine;
- then continue from where they are, following the conventions below. Keep their existing
  patterns; don't redo finished work.

### Case B — the folder is empty (no `package.json`)
Build a small working base by doing Steps 1–5 below.

### Step 1 — Scaffold the project (React + Next.js)
Create a Next.js app in the current folder with TypeScript, Tailwind, App Router and a `src`
dir. Use a non-interactive command, e.g.:
```
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```
Then add internationalization: `npm install next-intl`. Create the i18n skeleton
(`src/i18n/routing.ts`, `request.ts`, `navigation.ts`), `src/middleware.ts` (locale detection),
the `src/app/[locale]/` structure, `messages/` folder, and a `public/images/` folder.
(Add `next-auth` + `pg` later, ONLY if the user later says they want user accounts.)

### Step 2 — Ask the user just two things
Ask ONLY:
1. **What is the brand name?**
2. **What do you sell / do?** (one line, e.g. "laser machines", "handmade furniture")

Do NOT ask how many products they have, how many pages, colors, locales, or company details.
Pick sensible defaults for everything else (see Defaults below). You can always add more later.

### Step 3 — Ask for the logo
Tell the user, in plain words:
> "Put your logo image in the `public/images/` folder (for example `public/images/logo.png`),
> then tell me the file name."
Wait until they confirm the file is there.

### Step 4 — Read the logo to learn the brand
Open the logo with the Read tool (it can view images). From the logo, infer:
- the **brand colors** (primary, a darker accent, and a text/ink color) → set them as theme
  tokens in `src/app/globals.css`,
- the overall **style** (modern, industrial, elegant...) → guide spacing/typography choices.
Use the same logo as the **favicon**. If the logo is unclear, ask for a hex color or two.

### Step 5 — Confirm, build the BASE only, then hand over
Fill the **BRAND PROFILE** below, give the user a one-line summary to confirm, then build ONLY a
small working base:
- theme from the logo (colors in `globals.css`),
- i18n skeleton + `middleware.ts`,
- layout: `Header` (logo + nav + language switcher) + `Footer`,
- a minimal home page (hero with the brand name/slogan) and empty placeholder pages.
Run it (`npm run dev`) so the user sees something live. Then STOP and say, in plain words:
> "The base is ready. Now send me a photo or an example for each page or section you want (for
> example, how the homepage should look), and I'll build them one by one."

Do NOT build out every page/section up front. Build the rest incrementally from the user's
photos and instructions — see **Working iteratively** below.

---

## Working iteratively (after the base)

The user gives you photos, screenshots of sites they like, or plain descriptions ("I want the
homepage hero like this"). For each request:
1. Build or adjust that one page/section to match the reference, using the brand theme and the
   conventions in section 5.
2. Put all visible text into the `messages/` files (translated into every locale); put all
   product data into `src/data/products.json`. YOU write these, never the user.
3. When they send product photos + a description, add the product to `products.json` yourself
   (generate the id, translate every field).
4. Show the result with `npm run dev` and iterate from their feedback.

Build pieces roughly in the order of section 3, but only when the user asks for them.

---

## BRAND PROFILE (Claude fills this in)

- **Brand name:** {{BRAND_NAME}}
- **Sells / does:** {{ONE_LINE}}
- **Logo file:** {{public/images/...}}
- **Colors (from logo):** primary {{#HEX}}, dark {{#HEX}}, ink/text {{#HEX}}
- **Default locale:** {{e.g. ro}} (+ English fallback)

## Defaults (use these unless the user says otherwise)

- **Locales:** default = the language the user is chatting in (detect it, don't ask), plus `en`
  as fallback. Add more locales only on request.
- **Pages:** home, products/catalog, about, contact, plus legal pages (privacy, terms, cookies).
- **Catalog:** create the structure ONLY — `src/data/products.json` with an **empty** products
  array, a `src/lib/products.ts` helper, and list + `[id]` detail pages that show a graceful
  "no products yet" empty state. Do NOT invent placeholder products.
- **Adding products is YOUR job, not the user's.** The user never edits files. Whenever they
  describe a product (just text + maybe specs, and image filenames they dropped in
  `public/images/`), YOU write it into `src/data/products.json` in the correct format, generate
  an `id`, and translate every field into all locales. Ask only for the description and images;
  you handle the JSON. Same for any other content the user wants changed.
- **Accounts:** none, unless asked.
- **Deploy:** Vercel.

---

## 1. Stack

- **Next.js (App Router, `src/app`)** + **React** + **TypeScript**
- **Tailwind CSS** — theme tokens in `src/app/globals.css`
- **next-intl** — internationalization
- **next-auth** + **PostgreSQL** (`pg`) — only if the site needs accounts
- Deploy on **Vercel**

## 2. Commands

```
npm run dev        # local dev server (use this, not npm start)
npm run build      # production build
npm run lint       # eslint
npx tsc --noEmit   # type-check — fast way to verify edits
```

## 3. Build order (the target shape — steps 1-4 are the base; build 5-10 on request)

1. **Setup + theme** — `globals.css` theme tokens (colors from the logo), fonts, a
   `.container-page` gutter utility; logo + favicon in `public/images/`.
2. **i18n skeleton** — `routing.ts` (locales), `request.ts`, `navigation.ts`, `middleware.ts`,
   `messages/<default-locale>.json`.
3. **Global layout** — `src/app/[locale]/layout.tsx` + `Header` (nav + language switcher) + `Footer`.
4. **Home page** — `src/app/[locale]/page.tsx` (hero + sections).
5. **Catalog** — `src/data/products.json` (start with an EMPTY products array), helpers in
   `src/lib/`, list page + `[id]` detail with an empty state. Products are added later by YOU
   from the user's description (the user never edits the JSON themselves).
6. **Content pages** — about, contact.
7. **Legal pages** — privacy, terms, cookies (one shared `LegalPage` component + a `Legal`
   section in the message files).
8. **Forms + API** — contact/quote forms with `src/app/api/*` routes; add rate-limiting.
9. **Auth** (optional) — login/register/account + next-auth + Postgres.
10. **SEO + polish** — `sitemap.ts`, per-page metadata, cookie banner, `not-found`.

> Do not move past a step until layout + i18n are solid. Everything else depends on them.

## 4. Folder layout

```
src/app/[locale]/        Visible pages (home = page.tsx, + catalog/legal/etc.)
src/app/[locale]/layout.tsx   Shared shell (Header, Footer, providers)
src/app/api/             Backend routes
src/app/globals.css      Theme tokens + global styles
src/app/sitemap.ts       SEO (derives from routing.locales)
src/components/          Reusable UI
src/i18n/                routing.ts / request.ts / navigation.ts
src/lib/                 Logic (data helpers, db, auth, rate-limit)
src/data/                Catalog/product content (JSON)
messages/<locale>.json   UI translations, identical key sets across locales
src/middleware.ts        Locale detection
public/images/           Logo, favicon, photos
```

## 5. Core conventions (non-negotiable)

1. **Content is separated from code.** Never hard-code visible text in `.tsx`. UI strings →
   `messages/<locale>.json`; catalog content → `src/data/`.
2. **One source language**, mirrored into the others. **All locale files must share identical
   keys.** Change a string → update every locale file.
3. **`routing.locales` is the single source of truth for languages.** sitemap, layout and
   `generateStaticParams` derive from it.
4. **Server Components by default.** Add `"use client"` only for interactivity (carousels,
   forms, switchers, banners).
5. **Mobile-first.** Base styles for phones, then `sm:`/`lg:`. Avoid `w-screen`/`100vw` widths;
   add `overflow-x: clip` on `html, body` as a safety net against sideways scroll.
6. **Reuse, don't duplicate.** If you copy markup, extract a component.

## 6. Locale detection (`src/middleware.ts`)

(1) browser `Accept-Language` first match wins, (2) optional country fallback, (3) final
fallback = **English**. A manually chosen locale (`NEXT_LOCALE` cookie from the switcher)
always wins. GDPR: cookie-banner toggles for non-essential cookies start **unchecked** (opt-in).

## 7. Copy style

- Human, not "AI". No em-dashes (—); use commas, periods, parentheses.
- No invented statistics, no fake brand/component names. Keep the brand slogan present if there is one.
- Legal/GDPR text is real and formal — write it accurately, don't paraphrase loosely.

## 8. Gotchas

- If the repo lives in **OneDrive/Dropbox**, sync can corrupt `.next` — prefer `npm run dev`,
  delete `.next` if the build acts up.
- **Locale "sticks"** via `NEXT_LOCALE`; test detection in an incognito window.
- **Catalog items are not translated from `messages/`** — they carry their own translations in
  `src/data/`; an untranslated locale there falls back to the source language.
- Keep large data files out of anything a **client component** imports directly.

## 9. Verifying work

Run `npx tsc --noEmit` after edits; run `npm run dev` and check a mobile viewport for UI
changes. When unsure where to start: foundation (layout + i18n) first, then outward.
