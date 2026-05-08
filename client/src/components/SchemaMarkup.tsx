import { products, type Product } from "@/lib/products";

const SITE_URL = "https://takelumadaily.com";
const BRAND_NAME = "Luma Daily";
const ORGANIZATION_NAME = "Luma Wellness Group";
const DEFAULT_IMAGE = `${SITE_URL}/og/luma-daily-og.jpg`;

type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];

interface JsonLdObject {
  [key: string]: JsonLdValue;
}

const productDescriptions: Record<string, string> = {
  energy:
    "Luma Energy supports energy + focus with Blood Orange Mango gummies made for an easy morning ritual.",
  calm:
    "Luma Calm supports calm + stress balance with Raspberry Hibiscus gummies for a steady daily ritual.",
  sleep:
    "Luma Sleep supports restful sleep with Blueberry Lavender gummies for a consistent nighttime ritual.",
  glow:
    "Luma Glow supports healthy skin, hair + nails with Strawberry Peach gummies for beauty from within.",
  gut:
    "Luma Gut supports digestive wellness with Citrus Mint gummies designed for everyday consistency.",
  focus:
    "Luma Focus supports focus + clarity with gummies designed to make daily wellness feel simple.",
};

function absoluteUrl(path?: string) {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: ORGANIZATION_NAME,
        url: SITE_URL,
        brand: {
          "@type": "Brand",
          name: BRAND_NAME,
        },
        sameAs: [],
      }}
    />
  );
}

export function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: BRAND_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/shop?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductSchema({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.fullName,
        image: [absoluteUrl(product.image)],
        description:
          productDescriptions[product.slug] ??
          `${product.fullName} gummies are made for a simple daily wellness ritual.`,
        brand: {
          "@type": "Brand",
          name: BRAND_NAME,
        },
        sku: `luma-${product.slug}`,
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/products/${product.slug}`,
          priceCurrency: "USD",
          price: product.price.toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating.toFixed(1),
          reviewCount: product.reviews,
        },
      }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}

export function FAQSchema({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  path,
  datePublished,
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: DEFAULT_IMAGE,
        datePublished: datePublished ?? "2026-05-01",
        author: {
          "@type": "Organization",
          name: ORGANIZATION_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: ORGANIZATION_NAME,
        },
        mainEntityOfPage: absoluteUrl(path),
      }}
    />
  );
}

export function CollectionPageSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Shop Luma Daily Gummies",
        description:
          "Shop premium wellness gummies for energy, calm, sleep, glow, and gut support.",
        url: `${SITE_URL}/shop`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: products.slice(0, 5).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/products/${product.slug}`,
            name: product.fullName,
          })),
        },
      }}
    />
  );
}
