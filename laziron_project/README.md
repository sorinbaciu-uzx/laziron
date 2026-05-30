# LAZIRON

Site de prezentare pentru mașini de tăiere cu laser (tablă & țeavă metalică).
Construit cu **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + next-intl**.

## Limbi

Site-ul este multilingv. Limba sursă este **româna**, cu traduceri în engleză,
cehă și poloneză:

| Cod  | Limbă     | URL          |
| ---- | --------- | ------------ |
| `ro` | Română    | `/` (implicit) |
| `en` | Engleză   | `/en`        |
| `cs` | Cehă      | `/cs`        |
| `pl` | Poloneză  | `/pl`        |

Textele traduse se află în `messages/{ro,en,cs,pl}.json`.

## Comenzi

```bash
npm install      # instalează dependențele
npm run dev      # server de dezvoltare → http://localhost:3000
npm run build    # build de producție
npm start        # rulează build-ul de producție
```

## Structură

```
src/
  app/[locale]/            # rute (toate sub segmentul de limbă)
    page.tsx               # Acasă
    products/page.tsx      # listă produse
    products/[id]/page.tsx # detaliu produs
    industry-solutions/    # Soluții industriale
    contact/               # Contact (formular)
  components/              # Header, Footer, LanguageSwitcher, ProductCard, ContactForm
  data/products.json       # baza de date a produselor (JSON)
  i18n/                    # configurare next-intl (routing, request, navigation)
  lib/products.ts          # încărcare + localizare produse
messages/                  # traduceri UI (ro, en, cs, pl)
public/
  brand.png                # logo
  favicon.png              # favicon
  images/produse/<id>/     # imaginile fiecărui produs
```

## Cum adaugi un produs

1. Adaugă o intrare în `src/data/products.json` (vezi produsul existent ca model).
   Fiecare produs are:
   - `id` — identificator unic (ex: `lz-t-6015`)
   - `series`, `featured`, `order`
   - `images` — numele fișierelor din folderul produsului (primul = coperta)
   - `specs` — perechi `key`/`value` (cheia se traduce din `ProductDetail.specLabels`)
   - `translations` — conținut pe fiecare limbă (`ro`, `en`, `cs`, `pl`)
2. Pune imaginile în `public/images/produse/<id>/`.

> Meniul conține doar **Produse**, **Soluții industriale** și **Contact** —
> fără bară de căutare.

## De făcut ulterior

- Conectarea formularului de contact la un serviciu de email / API route
  (acum afișează doar un mesaj de confirmare local).
