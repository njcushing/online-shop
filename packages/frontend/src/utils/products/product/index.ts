import { CSSProperties } from "react";

export const lowStockThreshold = 50;

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

export type Collection = {
    id: string;
    type: "quantity";
};

export type Product = {
    id: string;
    name: {
        full: string;
        shorthands: { type: Collection["type"]; value: string }[];
    };
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
    variantOptionOrder: string[];
    customisations: { id: string; options: string[] }[];
    releaseDate: string;
};

export const variantOptions: ProductVariantOption[] = [
    {
        id: "blend",
        title: "Choose a blend",
        type: "dot",
        values: [
            { id: "HO", name: "House", dot: "#FFECDA" },
            { id: "LT", name: "Light", dot: "#E7A67A" },
            { id: "MD", name: "Medium", dot: "#945A38" },
            { id: "DK", name: "Dark", dot: "#523727" },
            { id: "XD", name: "Extra Dark", dot: "#251515" },
            { id: "BK", name: "Breakfast", dot: "#F6D6C3" },
            { id: "PK", name: "Pumpkin Spice", dot: "#dda774" },
            { id: "MO", name: "Mocha", dot: "#7c624a" },
            { id: "ES", name: "Espresso", dot: "#533B3A" },
            { id: "VA", name: "Vanilla", dot: "#ae8ec9" },
            { id: "CA", name: "Caramel", dot: "#e4ab60" },
            { id: "IN", name: "Intense", dot: "#f8df8d" },
            { id: "FR", name: "French Roast", dot: "#9bdbd6" },
            { id: "IR", name: "Italian Roast", dot: "#89d687" },
        ],
    },
];

export const products: Product[] = [
    {
        id: "1",
        name: {
            full: "Coffee - Whole Bean - 250g",
            shorthands: [{ type: "quantity", value: "250g bag" }],
        },
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
                stock: 40,
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
                stock: 0,
                options: { blend: "DK" },
            },
        ],
        variantOptionOrder: ["blend"],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
    {
        id: "2",
        name: {
            full: "Coffee - Whole Bean - 500g",
            shorthands: [{ type: "quantity", value: "500g bag" }],
        },
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
                options: { blend: "DK" },
            },
        ],
        variantOptionOrder: ["blend"],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
    {
        id: "3",
        name: {
            full: "Coffee - Whole Bean - 1kg",
            shorthands: [{ type: "quantity", value: "1kg bag" }],
        },
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
        variantOptionOrder: ["blend"],
        customisations: [],
        releaseDate: new Date().toISOString(),
    },
];

export const collections: Collection[] = [{ id: "coffee-wholebean", type: "quantity" }];

export const collectionsProducts: { collectionId: string; productId: string }[] = [
    { collectionId: "coffee-wholebean", productId: "1" },
    { collectionId: "coffee-wholebean", productId: "2" },
    { collectionId: "coffee-wholebean", productId: "3" },
];

export const findProductFromId = (productId: string): Product | undefined => {
    return products.find((product) => product.id === productId);
};

export const findProductFromSlug = (productSlug: string): Product | undefined => {
    return products.find((product) => product.slug === productSlug);
};

export const findCollections = (
    productId: string,
): { collection: Collection; products: Product[] }[] => {
    const matchedCollectionIds = collectionsProducts
        .filter((entry) => entry.productId === productId)
        .map((entry) => entry.collectionId);

    return matchedCollectionIds.flatMap((collectionId) => {
        const matchedCollection = collections.find((collection) => collection.id === collectionId);
        if (!matchedCollection) return [];

        const matchedProductIds = collectionsProducts
            .filter((entry) => entry.collectionId === collectionId)
            .map((entry) => entry.productId);

        const matchedProducts = products.filter((product) =>
            matchedProductIds.includes(product.id),
        );

        return [{ collection: matchedCollection, products: matchedProducts }];
    });
};

export const filterVariantOptions = (
    product: Product,
    selectedVariantOptions: ProductVariant["options"],
): Map<string, Set<string>> => {
    const { variants, variantOptionOrder } = product;
    if (variantOptionOrder.length === 0) return new Map();
    const baseOptionId = variantOptionOrder[0];

    const options = new Map<string, Set<string>>(variantOptionOrder.map((o) => [o, new Set()]));

    options.set(
        baseOptionId,
        new Set(variants.map((v) => v.options[baseOptionId]).filter((a) => a !== undefined)),
    );

    const matchedVariants = structuredClone(variants);
    for (let i = 1; i < variantOptionOrder.length; i++) {
        const ancestorOptionId = variantOptionOrder[i - 1];
        const currentOptionId = variantOptionOrder[i];

        for (let j = matchedVariants.length - 1; j >= 0; j--) {
            const variant = matchedVariants[j];

            const variantAncestorOptionValue = variant.options[ancestorOptionId];
            const variantOptionValue = variant.options[currentOptionId];

            const selectedVariantAncestorOptionValue = selectedVariantOptions[ancestorOptionId];

            if (
                variantAncestorOptionValue !== undefined &&
                variantOptionValue !== undefined &&
                selectedVariantAncestorOptionValue !== undefined &&
                variantAncestorOptionValue === selectedVariantAncestorOptionValue
            ) {
                options.get(currentOptionId)!.add(variantOptionValue);
            } else {
                matchedVariants.splice(j, 1);
            }
        }
    }

    return options;
};

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

export const findVariantFromId = (id: ProductVariant["id"]): ProductVariant | null => {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        for (let j = 0; j < product.variants.length; j++) {
            const variant = product.variants[j];
            if (variant.id === id) return variant;
        }
    }
    return null;
};

export const findVariantFromOptions = (
    product: Product,
    options: ProductVariant["options"],
    exact: boolean = false,
): ProductVariant | null => {
    const { variants } = product;
    if (variants.length === 0) return null;

    const optionEntries = Object.entries(options);

    let closestMatch: ProductVariant = variants[0];
    let closestMatchCount = 0;

    for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];

        for (let j = 0; j < optionEntries.length; j++) {
            const [key, value] = optionEntries[j];
            if (variant.options[key] !== value) {
                if (j > closestMatchCount) {
                    closestMatch = variant;
                    closestMatchCount = j;
                }
                break;
            }
            if (j === optionEntries.length - 1) return variant;
        }
    }

    return exact ? null : closestMatch;
};
