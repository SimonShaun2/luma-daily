import type { Product } from "@/lib/products";

export const SITE_NAME = "Luma Daily";
export const SITE_URL = "https://takelumadaily.com";
export const BRAND_NAME = "Luma Daily";
export const ORGANIZATION_NAME = "Luma Wellness Group";

export const DEFAULT_SEO = {
  title: "Luma Daily | Daily Wellness Gummies",
  description:
    "Build a simple daily wellness ritual with premium gummies for energy, calm, sleep, glow, and gut support.",
  image: "/og/luma-daily-og.jpg",
  type: "website",
} as const;

export type SeoType = "website" | "product" | "article";

export interface SeoConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: SeoType;
  noIndex?: boolean;
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

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function getProductSeo(product: Product): SeoConfig {
  return {
    title: `${product.fullName} ${product.flavor ? `| ${product.flavor}` : ""} Gummies`,
    description:
      productDescriptions[product.slug] ??
      `${product.fullName} gummies are built for a simple daily wellness ritual.`,
    path: `/products/${product.slug}`,
    image: product.image,
    type: "product",
  };
}

export const ROUTE_SEO: Record<string, SeoConfig> = {
  "/": {
    title: "Daily Wellness Gummies for Energy, Calm, Sleep, Glow + Gut",
    description:
      "Take the 60-second quiz and build a premium daily gummy ritual for energy, calm, sleep, glow, and gut support.",
    path: "/",
  },
  "/shop": {
    title: "Shop Daily Wellness Gummies",
    description:
      "Shop Luma Daily gummies and bundle a daily wellness ritual for energy, calm, sleep, glow, and gut support.",
    path: "/shop",
  },
  "/quiz": {
    title: "Build My Ritual Quiz",
    description:
      "Answer a few quick questions and get a personalized Luma Daily gummy ritual matched to your wellness goals.",
    path: "/quiz",
  },
  "/about": {
    title: "About Luma Daily",
    description:
      "Meet Luma Daily, a premium wellness gummy brand built around simple daily rituals and clean structure/function support.",
    path: "/about",
  },
  "/ingredients": {
    title: "Luma Daily Ingredients",
    description:
      "Explore the ingredients behind Luma Daily gummies, including botanicals, vitamins, minerals, and prebiotic support.",
    path: "/ingredients",
  },
  "/contact": {
    title: "Contact Luma Daily",
    description:
      "Contact Luma Daily support for help with orders, subscriptions, product questions, and daily ritual guidance.",
    path: "/contact",
  },
  "/shipping": {
    title: "Shipping + Returns",
    description:
      "Review Luma Daily shipping, delivery, subscription, and return information before starting your ritual.",
    path: "/shipping",
  },
  "/privacy": {
    title: "Privacy Policy",
    description: "Read the Luma Daily privacy policy and how customer information is handled.",
    path: "/privacy",
  },
  "/terms": {
    title: "Terms of Service",
    description: "Read the Luma Daily terms of service for use of the website and purchases.",
    path: "/terms",
  },
};
