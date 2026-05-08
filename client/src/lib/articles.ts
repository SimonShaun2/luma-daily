export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  body: string[];
  relatedProductSlugs: string[];
  relatedArticleSlugs: string[];
}

export interface GoalLandingPage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{ heading: string; copy: string }>;
  productSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const articles: Article[] = [
  {
    slug: "how-to-build-a-daily-wellness-ritual",
    title: "How to Build a Daily Wellness Ritual You Can Actually Keep",
    excerpt:
      "A simple framework for pairing gummies with the moments you already have: morning, midday, and night.",
    category: "Ritual Guide",
    readTime: "4 min read",
    relatedProductSlugs: ["energy", "calm", "sleep"],
    relatedArticleSlugs: ["energy-calm-sleep-routine", "supplement-routine-gummies"],
    body: [
      "The best wellness routine is the one that fits into real life. Instead of building a complicated cabinet of products, start by choosing the daily moments you already repeat.",
      "Morning is a natural place for energy support. Midday is where many people want calm, steady focus. Evening is where a consistent wind-down ritual can make wellness feel easier to repeat.",
      "Luma Daily is built around this simple rhythm: choose the support you want most, then layer complementary formulas only when they make your day feel simpler.",
    ],
  },
  {
    slug: "energy-calm-sleep-routine",
    title: "Energy, Calm, Sleep: The Three-Part Daily Ritual",
    excerpt:
      "Why a balanced morning-to-night ritual can be easier to maintain than a pile of disconnected supplements.",
    category: "Daily Rituals",
    readTime: "5 min read",
    relatedProductSlugs: ["energy", "calm", "sleep"],
    relatedArticleSlugs: ["how-to-build-a-daily-wellness-ritual", "supplement-routine-gummies"],
    body: [
      "A balanced wellness ritual does not need to be complicated. Most customers start by anchoring support to three points in the day: morning, afternoon, and evening.",
      "Luma Energy supports energy + focus in the morning. Luma Calm supports calm + stress balance during the day. Luma Sleep supports restful sleep as part of a nighttime routine.",
      "The goal is consistency. When your ritual is clear, repeatable, and enjoyable, it becomes easier to keep.",
    ],
  },
  {
    slug: "gut-glow-daily-wellness",
    title: "Where Gut and Glow Fit Into a Daily Gummy Routine",
    excerpt:
      "How digestive wellness and beauty-from-within support can complement your core daily ritual.",
    category: "Ingredient Notes",
    readTime: "4 min read",
    relatedProductSlugs: ["gut", "glow", "calm"],
    relatedArticleSlugs: ["how-to-build-a-daily-wellness-ritual", "supplement-routine-gummies"],
    body: [
      "Gut and glow support are often the easiest add-ons because they fit into a daily routine without requiring a new habit window.",
      "Luma Gut supports digestive wellness for everyday consistency. Luma Glow supports healthy skin, hair + nails as part of a beauty-from-within ritual.",
      "If you are not sure where to start, the quiz can recommend whether a simple, balanced, or full ritual is the best fit.",
    ],
  },
  {
    slug: "supplement-routine-gummies",
    title: "Supplement Routine Gummies: A Simpler Way to Stay Consistent",
    excerpt:
      "How gummies can make daily supplement routines more approachable without turning wellness into a chore.",
    category: "Wellness Basics",
    readTime: "3 min read",
    relatedProductSlugs: ["energy", "glow", "gut"],
    relatedArticleSlugs: ["how-to-build-a-daily-wellness-ritual", "gut-glow-daily-wellness"],
    body: [
      "Consistency is the hidden ingredient in most wellness routines. Gummies can help by making the habit easy to remember and easy to enjoy.",
      "The Luma Daily approach is product-forward but routine-first: each formula is designed around a clear moment, benefit, and flavor experience.",
      "Start with one formula, build a balanced trio, or choose the full ritual if you want complete daily support.",
    ],
  },
];

export const goalLandingPages: GoalLandingPage[] = [
  {
    slug: "energy-gummies",
    eyebrow: "Morning support",
    title: "Energy Gummies for a Simple Morning Ritual",
    description:
      "Luma Energy supports energy + focus with Blood Orange Mango gummies designed for daily consistency.",
    productSlugs: ["energy"],
    sections: [
      {
        heading: "Built for the morning moment",
        copy: "Pair Luma Energy with breakfast, coffee, or the first focused block of your day.",
      },
      {
        heading: "Designed to stack",
        copy: "Energy pairs naturally with Calm for the afternoon and Sleep for the evening.",
      },
    ],
    faqs: [
      {
        question: "When should I take energy gummies?",
        answer: "Most customers take Luma Energy in the morning or early afternoon.",
      },
    ],
  },
  {
    slug: "sleep-gummies",
    eyebrow: "Night support",
    title: "Sleep Gummies for a Consistent Nighttime Ritual",
    description:
      "Luma Sleep supports restful sleep with Blueberry Lavender gummies made for a simple wind-down routine.",
    productSlugs: ["sleep"],
    sections: [
      {
        heading: "Make the cue obvious",
        copy: "Keep your sleep ritual connected to a repeatable evening habit, like brushing teeth or making tea.",
      },
      {
        heading: "Pair with daily rhythm",
        copy: "Sleep fits best when the rest of your day has simple morning and afternoon anchors.",
      },
    ],
    faqs: [
      {
        question: "Can I take Luma Sleep every night?",
        answer: "Follow the product directions and consult a healthcare provider if you have questions about your routine.",
      },
    ],
  },
  {
    slug: "beauty-gummies",
    eyebrow: "Glow support",
    title: "Beauty Gummies for Healthy Skin, Hair + Nails Support",
    description:
      "Luma Glow supports healthy skin, hair + nails with Strawberry Peach gummies for beauty from within.",
    productSlugs: ["glow"],
    sections: [
      {
        heading: "A daily beauty anchor",
        copy: "Glow works well as a daily formula because beauty-from-within routines depend on consistency.",
      },
      {
        heading: "Easy to bundle",
        copy: "Pair Glow with Gut or Calm for a broader daily wellness ritual.",
      },
    ],
    faqs: [
      {
        question: "How should I add Glow to my routine?",
        answer: "Take Luma Glow as directed, ideally at the same time each day to support consistency.",
      },
    ],
  },
  {
    slug: "gut-health-gummies",
    eyebrow: "Digestive support",
    title: "Gut Health Gummies for Everyday Digestive Wellness",
    description:
      "Luma Gut supports digestive wellness with Citrus Mint gummies built for a daily ritual.",
    productSlugs: ["gut"],
    sections: [
      {
        heading: "Keep it tied to a meal",
        copy: "Digestive wellness routines are easiest to remember when connected to a daily meal.",
      },
      {
        heading: "Build around your goal",
        copy: "Gut can stand alone or pair with Glow, Energy, or the full ritual.",
      },
    ],
    faqs: [
      {
        question: "When should I take gut gummies?",
        answer: "Most customers take Luma Gut with a meal or at a consistent daily time.",
      },
    ],
  },
  {
    slug: "daily-wellness-gummies",
    eyebrow: "Full ritual",
    title: "Daily Wellness Gummies for Energy, Calm, Sleep, Glow + Gut",
    description:
      "Build a premium Luma Daily ritual with gummies that support your morning, afternoon, evening, beauty, and digestive routines.",
    productSlugs: ["energy", "calm", "sleep", "glow", "gut"],
    sections: [
      {
        heading: "Start with your highest-priority goal",
        copy: "Choose the support you want most, then add formulas only when they make your day feel simpler.",
      },
      {
        heading: "Use the quiz for personalization",
        copy: "The 60-second quiz recommends a simple, balanced, or full ritual based on your answers.",
      },
    ],
    faqs: [
      {
        question: "Do I need all five formulas?",
        answer: "No. Start simple if you prefer, or build a full ritual if you want support across the day.",
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getGoalLandingPage(slug: string) {
  return goalLandingPages.find((page) => page.slug === slug);
}
