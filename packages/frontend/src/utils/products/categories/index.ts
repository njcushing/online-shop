export type Category = {
    name: string;
    description: string;
    subcategories?: Category[];
    items?: string[];
};

export const categories: Category[] = [
    {
        name: "Coffee",
        description: "All coffee-related products.",
        subcategories: [
            { name: "Beans", description: "Whole coffee beans.", items: [] },
            { name: "Ground", description: "Pre-ground coffee for convenience.", items: [] },
            { name: "Instant & Pods", description: "Quick and easy coffee options.", items: [] },
            { name: "Cold Brew & Ready-to-Drink", description: "Pre-made cold brews.", items: [] },
        ],
    },
    {
        name: "Tea",
        description: "A variety of teas from around the world.",
        subcategories: [
            { name: "Loose Leaf", description: "High-quality loose tea leaves.", items: [] },
            { name: "Bags", description: "Convenient tea bags.", items: [] },
            { name: "Specialty & Powdered", description: "Matcha and chai powders.", items: [] },
            { name: "Ready-to-Drink", description: "Pre-bottled teas.", items: [] },
        ],
    },
    {
        name: "Equipment",
        description: "Everything you need to brew coffee & tea.",
        subcategories: [
            { name: "Brewing", description: "Manual brewing devices.", items: [] },
            {
                name: "Espresso Machines",
                description: "Machines for making espresso.",
                subcategories: [
                    { name: "Manual", description: "For barista-style espresso.", items: [] },
                    { name: "Automatic", description: "Push-button convenience.", items: [] },
                ],
            },
            { name: "Grinders", description: "For freshly ground coffee.", items: [] },
            { name: "Scales & Timers", description: "Precision tools for brewing.", items: [] },
            { name: "Cold Brew Makers", description: "Specialized cold brew tools.", items: [] },
        ],
    },
    {
        name: "Accessories",
        description: "Enhance your coffee and tea experience.",
        subcategories: [
            { name: "Mugs & Tumblers", description: "Drinkware for all beverages.", items: [] },
            {
                name: "Filters & Maintenance",
                description: "Reusable and disposable filters.",
                items: [],
            },
            { name: "Frothers & Steamers", description: "Tools for milk frothing.", items: [] },
        ],
    },
    {
        name: "Gifts & Subscriptions",
        description: "Great gifts for coffee and tea lovers.",
        subcategories: [
            { name: "Gift Sets & Sampler Packs", description: "Curated gift sets.", items: [] },
            {
                name: "Coffee Subscription Boxes",
                description: "Monthly coffee deliveries.",
                items: [],
            },
            { name: "Gift Cards", description: "Digital and physical gift cards.", items: [] },
        ],
    },
];
