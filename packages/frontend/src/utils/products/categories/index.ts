import { GenericImage } from "@/utils/types";

export type Category = {
    slug: string;
    name: string;
    description: string;
    subcategories?: Category[];
    products?: string[];
    img?: GenericImage;
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
                products: ["1", "2", "3"],
            },
            {
                slug: "ground",
                name: "Ground",
                description: "Pre-ground coffee for convenience.",
                products: [],
            },
            {
                slug: "instant-pods",
                name: "Instant & Pods",
                description: "Quick and easy coffee options.",
                products: [],
            },
            {
                slug: "cold-brew-ready",
                name: "Cold Brew & Ready-to-Drink",
                description: "Pre-made cold brews.",
                products: [],
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
                products: [],
            },
            {
                slug: "bags",
                name: "Bags",
                description: "Convenient tea bags.",
                products: [],
            },
            {
                slug: "specialty-and-powdered",
                name: "Specialty & Powdered",
                description: "Matcha and chai powders.",
                products: [],
            },
            {
                slug: "ready-to-drink",
                name: "Ready-to-Drink",
                description: "Pre-bottled teas.",
                products: [],
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
                products: [],
            },
            {
                slug: "espresso-machines",
                name: "Espresso Machines",
                description: "Machines for making espresso.",
                products: [],
            },
            {
                slug: "grinders",
                name: "Grinders",
                description: "For freshly ground coffee.",
                products: [],
            },
            {
                slug: "scales-timers",
                name: "Scales & Timers",
                description: "Precision tools for brewing.",
                products: [],
            },
            {
                slug: "cold-brew-makers",
                name: "Cold Brew Makers",
                description: "Specialized cold brew tools.",
                products: [],
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
                products: [],
            },
            {
                slug: "filters-maintenance",
                name: "Filters & Maintenance",
                description: "Reusable and disposable filters.",
                products: [],
            },
            {
                slug: "frothers-steamers",
                name: "Frothers & Steamers",
                description: "Tools for milk frothing.",
                products: [],
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
                products: [],
            },
            {
                slug: "subscription-boxes",
                name: "Coffee Subscription Boxes",
                description: "Monthly coffee deliveries.",
                products: [],
            },
            {
                slug: "gift-cards",
                name: "Gift Cards",
                description: "Digital and physical gift cards.",
                products: [],
            },
        ],
    },
];
