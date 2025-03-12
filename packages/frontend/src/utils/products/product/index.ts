import dayjs from "dayjs";
import { loremIpsum } from "lorem-ipsum";
import { v4 as uuid } from "uuid";

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
    sku: string;
    slug: string;
    price: {
        current: number;
        base: number;
    };
    images: { thumb: string; dynamic: string[] };
    rating: {
        value: number;
        quantity: number;
    };
    stock: number;
    allowance: number;
    tags: string[];
    customisations: { id: string; options: string[] }[];
    releaseDate: string;
};

export type ProductCollection = {
    type: string;
    products: string[];
};

export const collections: Record<string, ProductCollection> = {};

export const generateMockProduct = (): Product => {
    const basePrice = Math.floor(Math.random() * 16000 + 6000);

    return {
        id: uuid(),
        name: "Product Name",
        description: Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(() => {
            return loremIpsum({ count: Math.floor(Math.random() * 3) + 2 });
        }),
        sku: uuid(),
        slug: uuid(),
        price: {
            current: Math.random() < 0.5 ? basePrice : Math.floor(basePrice * Math.random()),
            base: basePrice,
        },
        images: { thumb: "", dynamic: [] },
        rating: {
            value: Math.random() * 2 + 3,
            quantity: Math.floor(Math.random() * 200 + 50),
        },
        stock: Math.floor(Math.random() * 100),
        allowance: Math.floor(Math.random() * 100) + 1,
        tags: [],
        customisations: [],
        releaseDate: dayjs(new Date())
            .subtract(Math.floor(Math.random() * 365), "day")
            .toISOString(),
    };
};
