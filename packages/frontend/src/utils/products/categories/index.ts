import { Product, generateMockProduct as i } from "@/utils/products/product";

export type Category = {
    slug: string;
    name: string;
    description: string;
    subcategories?: Category[];
    products?: Product[];
    img?: string;
};

export const categories: Category[] = [
    {
        slug: "coffee",
        name: "Coffee",
        description: "All coffee-related products.",
        subcategories: [
            {
                slug: "beans",
                name: "Beans",
                description: "Whole coffee beans.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "ground",
                name: "Ground",
                description: "Pre-ground coffee for convenience.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "instant-pods",
                name: "Instant & Pods",
                description: "Quick and easy coffee options.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "cold-brew-ready",
                name: "Cold Brew & Ready-to-Drink",
                description: "Pre-made cold brews.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
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
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "bags",
                name: "Bags",
                description: "Convenient tea bags.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "specialty-and-powdered",
                name: "Specialty & Powdered",
                description: "Matcha and chai powders.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "ready-to-drink",
                name: "Ready-to-Drink",
                description: "Pre-bottled teas.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
        ],
    },
    {
        slug: "equipment",
        name: "Equipment",
        description: "Everything you need to brew coffee & tea.",
        subcategories: [
            {
                slug: "brewing",
                name: "Brewing",
                description: "Manual brewing devices.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "espresso-machines",
                name: "Espresso Machines",
                description: "Machines for making espresso.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "grinders",
                name: "Grinders",
                description: "For freshly ground coffee.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "scales-timers",
                name: "Scales & Timers",
                description: "Precision tools for brewing.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "cold-brew-makers",
                name: "Cold Brew Makers",
                description: "Specialized cold brew tools.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
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
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "filters-maintenance",
                name: "Filters & Maintenance",
                description: "Reusable and disposable filters.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "frothers-steamers",
                name: "Frothers & Steamers",
                description: "Tools for milk frothing.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
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
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "subscription-boxes",
                name: "Coffee Subscription Boxes",
                description: "Monthly coffee deliveries.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
            {
                slug: "gift-cards",
                name: "Gift Cards",
                description: "Digital and physical gift cards.",
                products: Array.from({ length: Math.floor(Math.random() * 10 + 10) }).map(() =>
                    i(),
                ),
            },
        ],
    },
];
