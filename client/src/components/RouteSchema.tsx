import { useLocation } from "wouter";
import {
  ArticleSchema,
  BreadcrumbSchema,
  CollectionPageSchema,
  FAQSchema,
  OrganizationSchema,
  ProductSchema,
  WebsiteSchema,
} from "@/components/SchemaMarkup";
import { products } from "@/lib/products";

const homepageFaqs = [
  {
    question: "Can I take more than one Luma Daily formula together?",
    answer:
      "Yes. Luma Daily formulas are built to fit into one daily ritual, with products timed around morning, afternoon, and evening routines.",
  },
  {
    question: "Are Luma Daily gummies vegan and gluten-free?",
    answer:
      "Luma Daily gummies are designed with vegan, gluten-free, and third-party-tested quality standards.",
  },
  {
    question: "Can I subscribe and adjust my order?",
    answer:
      "Subscriptions are designed for daily consistency, with the ability to pause, skip, or adjust future orders.",
  },
];

function normalizePath(path: string) {
  const withoutQuery = path.split("?")[0] || "/";
  if (withoutQuery === "/") return "/";
  return withoutQuery.replace(/\/$/, "");
}

export default function RouteSchema() {
  const [location] = useLocation();
  const path = normalizePath(location);
  const productSlug = path.match(/^\/products\/([^/]+)$/)?.[1];
  const blogSlug = path.match(/^\/blog\/([^/]+)$/)?.[1];

  if (path === "/") {
    return (
      <>
        <OrganizationSchema />
        <WebsiteSchema />
        <FAQSchema questions={homepageFaqs} />
      </>
    );
  }

  if (path === "/shop") {
    return (
      <>
        <CollectionPageSchema />
        <BreadcrumbSchema
          items={[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]}
        />
      </>
    );
  }

  if (productSlug) {
    const product = products.find((item) => item.slug === productSlug);

    if (!product) return null;

    return (
      <>
        <ProductSchema product={product} />
        <BreadcrumbSchema
          items={[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.fullName, path },
          ]}
        />
      </>
    );
  }

  if (blogSlug) {
    return (
      <>
        <ArticleSchema
          title={blogSlug.replace(/-/g, " ")}
          description="Luma Daily ritual guidance for simple, consistent daily wellness routines."
          path={path}
        />
        <BreadcrumbSchema
          items={[
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: blogSlug.replace(/-/g, " "), path },
          ]}
        />
      </>
    );
  }

  const pageName = path.replace("/", "").replace(/-/g, " ");
  if (!pageName) return null;

  return (
    <BreadcrumbSchema
      items={[
        { name: "Home", path: "/" },
        { name: pageName, path },
      ]}
    />
  );
}
