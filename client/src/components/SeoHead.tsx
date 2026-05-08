import { useEffect } from "react";
import { absoluteUrl, buildTitle, DEFAULT_SEO, SITE_NAME, type SeoType } from "@/lib/seo";

interface SeoHeadProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: SeoType;
  noIndex?: boolean;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = url;
}

export default function SeoHead({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  path = "/",
  image = DEFAULT_SEO.image,
  type = DEFAULT_SEO.type,
  noIndex = false,
}: SeoHeadProps) {
  useEffect(() => {
    const pageTitle = buildTitle(title);
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(image);

    document.title = pageTitle;
    upsertCanonical(canonical);

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex,nofollow" : "index,follow",
    });

    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
  }, [description, image, noIndex, path, title, type]);

  return null;
}
