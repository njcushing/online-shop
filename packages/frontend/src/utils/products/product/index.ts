import dayjs from "dayjs";
import { loremIpsum } from "lorem-ipsum";
import { v4 as uuid } from "uuid";

export type ProductVariantOption = {
    title: string;
    image: string;
};

export type ProductVariantOptions = Record<string, Record<string, ProductVariantOption>>;

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
                options: { blend: "light" },
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
                options: { blend: "medium" },
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
                options: { blend: "dark" },
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
                options: { blend: "light" },
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
                options: { blend: "medium" },
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
                options: { blend: "light" },
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
                options: { blend: "medium" },
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
                options: { blend: "dark" },
            },
        ],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
];

export const generateMockProduct = (): Product => {
    const basePrice = Math.floor(Math.random() * 16000 + 6000);

    return {
        id: uuid(),
        name: "Product Name",
        description: Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(() => {
            return loremIpsum({ count: Math.floor(Math.random() * 3) + 2 });
        }),
        slug: uuid(),
        images: { thumb: "", dynamic: [] },
        rating: {
            value: Math.random() * 2 + 3,
            quantity: Math.floor(Math.random() * 200 + 50),
        },
        allowance: Math.floor(Math.random() * 100) + 1,
        tags: [],
        variants: [
            {
                id: uuid(),
                name: "Product Variant 1",
                sku: uuid(),
                price: {
                    current:
                        Math.random() < 0.5 ? basePrice : Math.floor(basePrice * Math.random()),
                    base: basePrice,
                },
                stock: Math.floor(Math.random() * 100),
                options: {},
            },
        ],
        customisations: [],
        releaseDate: dayjs(new Date())
            .subtract(Math.floor(Math.random() * 365), "day")
            .toISOString(),
    };
};
