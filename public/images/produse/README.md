# Imagini produse

Imaginile produselor se pun direct în acest folder (`public/images/produse/`),
ca fișiere plate denumite după `id`-ul produsului din `src/data/products.json`:

```
public/images/produse/
  <id>-1.webp    ← imaginea principală (cover): apare în listă și în hero
  <id>-2.webp    ← a doua imagine: apare imediat sub hero, pe pagina produsului
  <id>-3.webp    ← imagini suplimentare (opțional)
  ...
```

Exemplu pentru produsul cu `id` = `laz-001`:

```
public/images/produse/laz-001-1.webp
public/images/produse/laz-001-2.webp
```

În `products.json`, câmpul `images` conține **numele complete ale fișierelor**,
în ordine (prima = cover / hero, a doua = imaginea de sub hero):

```json
"images": ["laz-001-1.webp", "laz-001-2.webp"]
```

> Imaginea `-1` (cover/hero) e recomandată la ~1920 × 924 px.
> Formatele acceptate: `.webp`, `.jpg`, `.png`.
