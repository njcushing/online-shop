import { CSSProperties } from "react";

export type ProductVariantOptionValuesCore = {
    id: string;
    name: string;
};

export type ProductVariantOption = {
    id: string;
    title: string;
} & (
    | { type: "dot"; values: (ProductVariantOptionValuesCore & { dot: CSSProperties["color"] })[] }
    | { type: "image"; values: (ProductVariantOptionValuesCore & { image: string })[] }
);

export type ProductVariant = {
    id: string;
    name: string;
    sku: string;
    price: { current: number; base: number };
    stock: number;
    options: Record<string, string>;
    allowanceOverride?: number;
    image?: string;
};

export type ProductCustomisation = {
    name: string;
    options: Record<
        string,
        {
            value: string;
            priceModifier: { value: number; type: "number" | "percentage" };
            img: string;
        }
    >;
};

export type Product = {
    id: string;
    name: string;
    description: string[];
    slug: string;
    images: { thumb: string; dynamic: string[] };
    rating: {
        value: number;
        quantity: number;
    };
    allowance: number;
    tags: string[];
    variants: ProductVariant[];
    customisations: { id: string; options: string[] }[];
    releaseDate: string;
};

export type ProductCollection = {
    type: string;
    products: string[];
};

export const collections: Record<string, ProductCollection> = {};

export const variantOptions: ProductVariantOption[] = [
    {
        id: "blend",
        title: "Choose a blend",
        type: "dot",
        values: [
            { id: "LT", name: "Light", dot: "pink" },
            { id: "MD", name: "Medium", dot: "brown" },
            { id: "DK", name: "Dark", dot: "black" },
        ],
    },
];

export const products: Product[] = [
    {
        id: "1",
        name: "Coffee - Whole Bean - 250g",
        description: ["Product Description"],
        slug: "coffee-whole-bean-250g",
        images: { thumb: "", dynamic: [] },
        rating: {
            value: 4.87,
            quantity: 482,
        },
        allowance: 50,
        tags: [],
        variants: [
            {
                id: "1-1",
                name: "Variant 1",
                sku: "COF-WB-250G-LT",
                price: {
                    current: 700,
                    base: 700,
                },
                stock: 321,
                options: { blend: "LT" },
            },
            {
                id: "1-2",
                name: "Variant 2",
                sku: "COF-WB-250G-MD",
                price: {
                    current: 700,
                    base: 700,
                },
                stock: 73,
                options: { blend: "MD" },
            },
            {
                id: "1-3",
                name: "Variant 3",
                sku: "COF-WB-250G-DK",
                price: {
                    current: 700,
                    base: 700,
                },
                stock: 23,
                options: { blend: "DK" },
            },
        ],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Coffee - Whole Bean - 500g",
        description: ["Product Description"],
        slug: "coffee-whole-bean-500g",
        images: { thumb: "", dynamic: [] },
        rating: {
            value: 4.62,
            quantity: 370,
        },
        allowance: 30,
        tags: [],
        variants: [
            {
                id: "2-1",
                name: "Variant 1",
                sku: "COF-WB-500G-LT",
                price: {
                    current: 1250,
                    base: 1250,
                },
                stock: 237,
                options: { blend: "LT" },
            },
            {
                id: "2-2",
                name: "Variant 2",
                sku: "COF-WB-500G-MD",
                price: {
                    current: 1250,
                    base: 1250,
                },
                stock: 123,
                options: { blend: "MD" },
            },
            {
                id: "2-3",
                name: "Variant 3",
                sku: "COF-WB-500G-DK",
                price: {
                    current: 1250,
                    base: 1250,
                },
                stock: 382,
                options: { blend: "dark" },
            },
        ],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Coffee - Whole Bean - 1kg",
        description: ["Product Description"],
        slug: "coffee-whole-bean-1kg",
        images: { thumb: "", dynamic: [] },
        rating: {
            value: 4.9,
            quantity: 872,
        },
        allowance: 20,
        tags: [],
        variants: [
            {
                id: "3-1",
                name: "Variant 1",
                sku: "COF-WB-1KG-LT",
                price: {
                    current: 2250,
                    base: 2250,
                },
                stock: 89,
                options: { blend: "LT" },
            },
            {
                id: "3-2",
                name: "Variant 2",
                sku: "COF-WB-1KG-MD",
                price: {
                    current: 2250,
                    base: 2250,
                },
                stock: 76,
                options: { blend: "MD" },
            },
            {
                id: "3-3",
                name: "Variant 3",
                sku: "COF-WB-1KG-DK",
                price: {
                    current: 2250,
                    base: 2250,
                },
                stock: 102,
                options: { blend: "DK" },
            },
        ],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
];

export const extractVariantOptions = (product: Product): Map<string, Set<string>> => {
    const options = new Map<string, Set<string>>();

    const { variants } = product;

    variants.forEach((variant) => {
        Object.entries(variant.options).forEach((entry) => {
            const [key, value] = entry;
            if (!options.has(key)) options.set(key, new Set());
            options.get(key)!.add(value);
        });
    });

    return options;
};
