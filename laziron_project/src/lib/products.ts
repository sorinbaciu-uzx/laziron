import productsData from "@/data/products.json";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Base public path where all product images live.
 * Images are stored as flat files named `<id>-<n>.webp`, e.g.
 * `laz-001-1.webp` (main/cover + hero) and `laz-001-2.webp` (after hero).
 */
export const PRODUCT_IMAGE_BASE = "/images/produse";

/** A single key spec shown in the product hero. */
export interface ProductHighlight {
  label: string;
  value: string;
}

/** Translatable, locale-specific product content. */
export interface ProductTranslation {
  name: string;
  tagline: string;
  /** Key specs shown as a compact grid in the hero. */
  highlights: ProductHighlight[];
  /** Compatible materials / applications, shown as chips. */
  applications: string[];
  /** Rich HTML body rendered in the product detail page. */
  descriptionHtml: string;
}

/** Product categories, in the order they should appear on the products page. */
export type ProductCategory =
  | "sheet"
  | "tube"
  | "sheet-tube"
  | "bending"
  | "welding"
  | "cleaning";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "sheet",
  "tube",
  "sheet-tube",
  "bending",
  "welding",
  "cleaning",
];

/** Raw product entry as stored in products.json. */
export interface Product {
  id: string;
  series: string;
  category: ProductCategory;
  featured?: boolean;
  order?: number;
  /** Full image file names located in {@link PRODUCT_IMAGE_BASE}. */
  images: string[];
  translations: Partial<Record<Locale, ProductTranslation>>;
}

/** A product resolved for a single locale (translation merged in). */
export interface LocalizedProduct {
  id: string;
  series: string;
  category: ProductCategory;
  featured: boolean;
  /** Absolute public URL of the first/cover image (`-1`). */
  cover: string;
  /** Absolute public URL of the second image (`-2`), if present. */
  secondary?: string;
  /** Absolute public URLs of all images. */
  gallery: string[];
  content: ProductTranslation;
}

const products = (productsData.products as Product[])
  .slice()
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

/** Build the public URL for a product image file name. */
export function productImageUrl(filename: string): string {
  return `${PRODUCT_IMAGE_BASE}/${filename}`;
}

/**
 * Resolve a product's content for a locale, falling back to the default
 * locale (Romanian) when a translation is missing.
 */
export function localizeProduct(
  product: Product,
  locale: Locale,
): LocalizedProduct {
  const content =
    product.translations[locale] ??
    product.translations[routing.defaultLocale] ??
    Object.values(product.translations)[0]!;

  const gallery = product.images.map(productImageUrl);

  return {
    id: product.id,
    series: product.series,
    category: product.category,
    featured: Boolean(product.featured),
    cover: gallery[0],
    secondary: gallery[1],
    gallery,
    content,
  };
}

/** All products (raw), ordered. */
export function getAllProducts(): Product[] {
  return products;
}

/** All products localized for the given locale, ordered. */
export function getLocalizedProducts(locale: Locale): LocalizedProduct[] {
  return products.map((p) => localizeProduct(p, locale));
}

/** Localized products marked as featured. */
export function getFeaturedProducts(locale: Locale): LocalizedProduct[] {
  return getLocalizedProducts(locale).filter((p) => p.featured);
}

/** A single product by id, localized, or undefined if not found. */
export function getLocalizedProduct(
  id: string,
  locale: Locale,
): LocalizedProduct | undefined {
  const product = products.find((p) => p.id === id);
  return product ? localizeProduct(product, locale) : undefined;
}

/** All product ids — used for static params generation. */
export function getProductIds(): string[] {
  return products.map((p) => p.id);
}

/**
 * Localized products grouped by category, in {@link PRODUCT_CATEGORIES} order.
 * Empty categories are omitted.
 */
export function getProductsByCategory(
  locale: Locale,
): { category: ProductCategory; products: LocalizedProduct[] }[] {
  const all = getLocalizedProducts(locale);
  return PRODUCT_CATEGORIES.map((category) => ({
    category,
    products: all.filter((p) => p.category === category),
  })).filter((group) => group.products.length > 0);
}

/**
 * Returns products from the same category as the given one, excluding the
 * current product itself. Ordered by the same `order` field as the catalog.
 */
export function getSimilarProducts(
  id: string,
  locale: Locale,
  limit = 8,
): LocalizedProduct[] {
  const current = products.find((p) => p.id === id);
  if (!current) return [];
  return products
    .filter((p) => p.id !== id && p.category === current.category)
    .slice(0, limit)
    .map((p) => localizeProduct(p, locale));
}
