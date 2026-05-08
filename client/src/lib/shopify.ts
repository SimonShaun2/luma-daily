const API_VERSION = "2024-10";

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image: ShopifyImage | null;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifySellingPlanAdjustmentValue {
  __typename: string;
  adjustmentPercentage?: number;
  adjustmentAmount?: ShopifyMoney;
  price?: ShopifyMoney;
}

export interface ShopifySellingPlan {
  id: string;
  name: string;
  recurringDeliveries: boolean;
  priceAdjustments: Array<{
    orderCount: number | null;
    adjustmentValue: ShopifySellingPlanAdjustmentValue;
  }>;
}

export interface ShopifySellingPlanGroup {
  name: string;
  sellingPlans: {
    edges: Array<{ node: ShopifySellingPlan }>;
  };
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  type: string;
  value: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
  };
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  sellingPlanGroups: {
    edges: Array<{ node: ShopifySellingPlanGroup }>;
  };
  metafields: Array<ShopifyMetafield | null>;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    amountPerQuantity: ShopifyMoney;
    compareAtAmountPerQuantity: ShopifyMoney | null;
  };
  sellingPlanAllocation: {
    sellingPlan: Pick<ShopifySellingPlan, "id" | "name">;
    priceAdjustments: Array<{
      price: ShopifyMoney;
      compareAtPrice: ShopifyMoney | null;
      perDeliveryPrice: ShopifyMoney;
    }>;
  } | null;
  merchandise: ShopifyVariant & {
    product: Pick<
      ShopifyProduct,
      "id" | "handle" | "title" | "images" | "metafields"
    >;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface ShopifyCartUserError {
  field: string[] | null;
  message: string;
}

interface CartPayload {
  cart: ShopifyCart | null;
  userErrors: ShopifyCartUserError[];
}

const productMetafieldIdentifiers = `
  metafields(identifiers: [
    { namespace: "custom", key: "benefit" },
    { namespace: "custom", key: "flavor" },
    { namespace: "custom", key: "usage_time" },
    { namespace: "custom", key: "ingredients" },
    { namespace: "custom", key: "product_color" },
    { namespace: "custom", key: "accent_color" }
  ]) {
    namespace
    key
    type
    value
  }
`;

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    descriptionHtml
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    sellingPlanGroups(first: 5) {
      edges {
        node {
          name
          sellingPlans(first: 10) {
            edges {
              node {
                id
                name
                recurringDeliveries
                priceAdjustments {
                  orderCount
                  adjustmentValue {
                    __typename
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                    ... on SellingPlanFixedAmountPriceAdjustment {
                      adjustmentAmount {
                        amount
                        currencyCode
                      }
                    }
                    ... on SellingPlanFixedPriceAdjustment {
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ${productMetafieldIdentifiers}
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          sellingPlanAllocation {
            sellingPlan {
              id
              name
            }
            priceAdjustments {
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              perDeliveryPrice {
                amount
                currencyCode
              }
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                ${productMetafieldIdentifiers}
              }
            }
          }
        }
      }
    }
  }
`;

function getStoreDomain() {
  const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined;
  return domain?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? "";
}

function getStorefrontToken() {
  return import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
}

export function isShopifyConfigured() {
  const domain = getStoreDomain();
  const token = getStorefrontToken();
  return Boolean(domain && token && !token.includes("YOUR_"));
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const domain = getStoreDomain();
  const token = getStorefrontToken();

  if (!isShopifyConfigured() || !token) {
    throw new Error("Shopify Storefront API credentials are not configured.");
  }

  const response = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}.`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }

  if (!json.data) {
    throw new Error("Shopify response did not include data.");
  }

  return json.data;
}

function assertCartPayload(payload: CartPayload): ShopifyCart {
  if (payload.userErrors.length) {
    throw new Error(payload.userErrors.map((error) => error.message).join("; "));
  }

  if (!payload.cart) {
    throw new Error("Shopify did not return a cart.");
  }

  return payload.cart;
}

export async function getAllProducts(first = 50) {
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(
    `
      ${PRODUCT_FRAGMENT}
      query Products($first: Int!) {
        products(first: $first) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
    `,
    { first },
  );

  return data.products.edges.map((edge) => edge.node);
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductFragment
        }
      }
    `,
    { handle },
  );

  return data.productByHandle;
}

export async function createCart(lines: CartLineInput[] = []) {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>(
    `
      ${CART_FRAGMENT}
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { input: { lines } },
  );

  return assertCartPayload(data.cartCreate);
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
    `
      ${CART_FRAGMENT}
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFragment
        }
      }
    `,
    { cartId },
  );

  return data.cart;
}

export async function addCartLines(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>(
    `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { cartId, lines },
  );

  return assertCartPayload(data.cartLinesAdd);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>(
    `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { cartId, lineIds },
  );

  return assertCartPayload(data.cartLinesRemove);
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[],
) {
  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>(
    `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFragment
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    { cartId, lines },
  );

  return assertCartPayload(data.cartLinesUpdate);
}

export function getMonthlySellingPlan(product: ShopifyProduct) {
  const plans = product.sellingPlanGroups.edges.flatMap((group) =>
    group.node.sellingPlans.edges.map((edge) => edge.node),
  );

  return (
    plans.find((plan) => /month|30/i.test(plan.name)) ??
    plans.find((plan) => plan.recurringDeliveries) ??
    plans[0] ??
    null
  );
}

export function getSubscribePrice(product: ShopifyProduct) {
  const variant = product.variants.edges[0]?.node;
  const sellingPlan = getMonthlySellingPlan(product);

  if (!variant || !sellingPlan) {
    return null;
  }

  const price = Number(variant.price.amount);
  const adjustment = sellingPlan.priceAdjustments[0]?.adjustmentValue;

  if (!adjustment) {
    return price;
  }

  if (typeof adjustment.adjustmentPercentage === "number") {
    return Number((price * (1 - adjustment.adjustmentPercentage / 100)).toFixed(2));
  }

  if (adjustment.price) {
    return Number(Number(adjustment.price.amount).toFixed(2));
  }

  if (adjustment.adjustmentAmount) {
    return Number(Math.max(price - Number(adjustment.adjustmentAmount.amount), 0).toFixed(2));
  }

  return price;
}
