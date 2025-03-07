export type Category = {
    slug: string;
    name: string;
    description: string;
    subcategories?: Category[];
    items?: string[];
};

export const categories: Category[] = [
    {
        slug: "coffee",
        name: "Coffee",
        description: "All coffee-related products.",
        subcategories: [
            { slug: "beans", name: "Beans", description: "Whole coffee beans.", items: [] },
            {
                slug: "ground",
                name: "Ground",
                description: "Pre-ground coffee for convenience.",
                items: [],
            },
            {
                slug: "instant-pods",
                name: "Instant & Pods",
                description: "Quick and easy coffee options.",
                items: [],
            },
            {
                slug: "cold-brew-ready",
                name: "Cold Brew & Ready-to-Drink",
                description: "Pre-made cold brews.",
                items: [],
            },
        ],
    },
    {
        slug: "tea",
        name: "Tea",
        description: "A variety of teas from around the world.",
        subcategories: [
            {
                slug: "loose-leaf",
                name: "Loose Leaf",
                description: "High-quality loose tea leaves.",
                items: [],
            },
            { slug: "bags", name: "Bags", description: "Convenient tea bags.", items: [] },
            {
                slug: "specialty-and-powdered",
                name: "Specialty & Powdered",
                description: "Matcha and chai powders.",
                items: [],
            },
            {
                slug: "ready-to-drink",
                name: "Ready-to-Drink",
                description: "Pre-bottled teas.",
                items: [],
            },
        ],
    },
    {
        slug: "equipment",
        name: "Equipment",
        description: "Everything you need to brew coffee & tea.",
        subcategories: [
            { slug: "brewing", name: "Brewing", description: "Manual brewing devices.", items: [] },
            {
                slug: "espresso-machines",
                name: "Espresso Machines",
                description: "Machines for making espresso.",
                items: [],
            },
            {
                slug: "grinders",
                name: "Grinders",
                description: "For freshly ground coffee.",
                items: [],
            },
            {
                slug: "scales-timers",
                name: "Scales & Timers",
                description: "Precision tools for brewing.",
                items: [],
            },
            {
                slug: "cold-brew-makers",
                name: "Cold Brew Makers",
                description: "Specialized cold brew tools.",
                items: [],
            },
        ],
    },
    {
        slug: "accessories",
        name: "Accessories",
        description: "Enhance your coffee and tea experience.",
        subcategories: [
            {
                slug: "mugs-tumblers",
                name: "Mugs & Tumblers",
                description: "Drinkware for all beverages.",
                items: [],
            },
            {
                slug: "filters-maintenance",
                name: "Filters & Maintenance",
                description: "Reusable and disposable filters.",
                items: [],
            },
            {
                slug: "frothers-steamers",
                name: "Frothers & Steamers",
                description: "Tools for milk frothing.",
                items: [],
            },
        ],
    },
    {
        slug: "gifts-subscriptions",
        name: "Gifts & Subscriptions",
        description: "Great gifts for coffee and tea lovers.",
        subcategories: [
            {
                slug: "gift-sets-packs",
                name: "Gift Sets & Sampler Packs",
                description: "Curated gift sets.",
                items: [],
            },
            {
                slug: "subscription-boxes",
                name: "Coffee Subscription Boxes",
                description: "Monthly coffee deliveries.",
                items: [],
            },
            {
                slug: "gift-cards",
                name: "Gift Cards",
                description: "Digital and physical gift cards.",
                items: [],
            },
        ],
    },
];
