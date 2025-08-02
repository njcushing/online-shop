import { CSSProperties } from "react";
import { loremIpsum } from "lorem-ipsum";
import { generateDateWithinRandomRange } from "@/utils/dates";
import { GenericImage, RecursivePartial } from "@/utils/types";
import { v4 as uuid } from "uuid";

export type ProductVariantOptionValuesCore = {
    id: string;
    name: string;
};

export type ProductVariantOption = {
    id: string;
    name: string;
    title: string;
} & (
    | { type: "dot"; values: (ProductVariantOptionValuesCore & { dot: CSSProperties["color"] })[] }
    | { type: "image"; values: (ProductVariantOptionValuesCore & { image: GenericImage })[] }
);

export type ProductVariant = {
    id: string;
    name: string;
    sku: string;
    price: { current: number; base: number };
    stock: number;
    options: Record<string, string>;
    allowanceOverride?: number;
    image?: GenericImage;
    details: { name: string; value: string }[];
    subscriptionDiscountPercentage: number;
    releaseDate: string;
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

export type ProductReview = {
    id: string;
    productId: string;
    variantId: string;
    userId: string;
    rating: number;
    comment: string;
    images?: GenericImage[];
    datePosted: string;
};

export type Product = {
    id: string;
    name: {
        full: string;
        shorthands: { type: Collection["type"]; value: string }[];
    };
    description: string;
    slug: string;
    images: { thumb: GenericImage; dynamic: GenericImage[] };
    rating: {
        meanValue: number;
        totalQuantity: number;
        quantities: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };
    allowance: number;
    tags: string[];
    variants: ProductVariant[];
    variantOptionOrder: string[];
    customisations: { id: string; options: string[] }[];
    reviews: string[];
    releaseDate: string;
};

export const reviews: ProductReview[] = Array.from({ length: 1000 }).map((entry, i) => {
    const productId = `${Math.ceil(Math.random() * 3)}`;
    const variantId = `${productId}-${Math.ceil(Math.random() * 3)}`;

    return {
        id: `review-${i}`,
        productId,
        variantId,
        userId: "",
        rating: Math.ceil((1 - Math.random() ** 5) * 5),
        comment: `${loremIpsum({
            paragraphLowerBound: 3,
            paragraphUpperBound: 9,
            sentenceLowerBound: 16,
            sentenceUpperBound: 40,
        })}`,
        images: [],
        datePosted: generateDateWithinRandomRange(new Date("2024-01-01"), new Date()).toISOString(),
    };
});
const reviewMap = Object.fromEntries(reviews.map((review) => [review.id, review]));

export const variantOptions: ProductVariantOption[] = [
    {
        id: "blend",
        name: "Blend",
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
        description: "",
        slug: "coffee-whole-bean-250g",
        images: {
            thumb: { src: "", alt: "" },
            dynamic: [
                { src: "a", alt: "" },
                { src: "b", alt: "" },
                { src: "c", alt: "" },
                { src: "d", alt: "" },
                { src: "e", alt: "" },
            ],
        },
        rating: { meanValue: 0, totalQuantity: 0, quantities: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        allowance: 50,
        tags: [],
        variants: [
            {
                id: "1-1",
                name: "Variant 1",
                sku: "COF-WB-250G-LT",
                price: {
                    current: 550,
                    base: 700,
                },
                stock: 321,
                options: { blend: "LT" },
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Light" },
                    { name: "Weight", value: "250g" },
                ],
                subscriptionDiscountPercentage: 10,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
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
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Medium" },
                    { name: "Weight", value: "250g" },
                ],
                subscriptionDiscountPercentage: 10,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
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
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Dark" },
                    { name: "Weight", value: "250g" },
                ],
                subscriptionDiscountPercentage: 15,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
            },
        ],
        variantOptionOrder: ["blend"],
        customisations: [],
        reviews: reviews.filter((review) => review.productId === "1").map((review) => review.id),
        releaseDate: generateDateWithinRandomRange(
            new Date("2024-01-01"),
            new Date(),
        ).toISOString(),
    },
    {
        id: "2",
        name: {
            full: "Coffee - Whole Bean - 500g",
            shorthands: [{ type: "quantity", value: "500g bag" }],
        },
        description: "",
        slug: "coffee-whole-bean-500g",
        images: {
            thumb: { src: "", alt: "" },
            dynamic: [
                { src: "a", alt: "" },
                { src: "b", alt: "" },
                { src: "c", alt: "" },
                { src: "d", alt: "" },
                { src: "e", alt: "" },
            ],
        },
        rating: { meanValue: 0, totalQuantity: 0, quantities: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
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
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Light" },
                    { name: "Weight", value: "500g" },
                ],
                subscriptionDiscountPercentage: 0,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
            },
            {
                id: "2-2",
                name: "Variant 2",
                sku: "COF-WB-500G-MD",
                price: {
                    current: 1100,
                    base: 1250,
                },
                stock: 123,
                options: { blend: "MD" },
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Medium" },
                    { name: "Weight", value: "500g" },
                ],
                subscriptionDiscountPercentage: 0,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
            },
            {
                id: "2-3",
                name: "Variant 3",
                sku: "COF-WB-500G-DK",
                price: {
                    current: 1100,
                    base: 1250,
                },
                stock: 382,
                options: { blend: "DK" },
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Dark" },
                    { name: "Weight", value: "500g" },
                ],
                subscriptionDiscountPercentage: 10,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
            },
        ],
        variantOptionOrder: ["blend"],
        customisations: [],
        reviews: reviews.filter((review) => review.productId === "2").map((review) => review.id),
        releaseDate: generateDateWithinRandomRange(
            new Date("2024-01-01"),
            new Date(),
        ).toISOString(),
    },
    {
        id: "3",
        name: {
            full: "Coffee - Whole Bean - 1kg",
            shorthands: [{ type: "quantity", value: "1kg bag" }],
        },
        description: "",
        slug: "coffee-whole-bean-1kg",
        images: {
            thumb: { src: "", alt: "" },
            dynamic: [
                { src: "a", alt: "" },
                { src: "b", alt: "" },
                { src: "c", alt: "" },
                { src: "d", alt: "" },
                { src: "e", alt: "" },
            ],
        },
        rating: { meanValue: 0, totalQuantity: 0, quantities: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        allowance: 20,
        tags: [],
        variants: [
            {
                id: "3-1",
                name: "Variant 1",
                sku: "COF-WB-1KG-LT",
                price: {
                    current: 1900,
                    base: 2250,
                },
                stock: 89,
                options: { blend: "LT" },
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Light" },
                    { name: "Weight", value: "1kg" },
                ],
                subscriptionDiscountPercentage: 0,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
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
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Medium" },
                    { name: "Weight", value: "1kg" },
                ],
                subscriptionDiscountPercentage: 10,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
            },
            {
                id: "3-3",
                name: "Variant 3",
                sku: "COF-WB-1KG-DK",
                price: {
                    current: 1900,
                    base: 2250,
                },
                stock: 102,
                options: { blend: "DK" },
                details: [
                    { name: "Category", value: "Coffee, Whole Bean" },
                    { name: "Blend", value: "Dark" },
                    { name: "Weight", value: "1kg" },
                ],
                subscriptionDiscountPercentage: 20,
                releaseDate: generateDateWithinRandomRange(
                    new Date("2024-01-01"),
                    new Date(),
                ).toISOString(),
            },
        ],
        variantOptionOrder: ["blend"],
        customisations: [],
        reviews: reviews.filter((review) => review.productId === "3").map((review) => review.id),
        releaseDate: generateDateWithinRandomRange(
            new Date("2024-01-01"),
            new Date(),
        ).toISOString(),
    },
];
(() => {
    products.forEach((product) => {
        const { rating, reviews: reviewIds } = product;

        const ratingsNew: Product["rating"] = {
            meanValue: 0,
            totalQuantity: 0,
            quantities: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
        reviewIds.forEach((reviewId) => {
            const foundReview = reviewMap[reviewId];
            if (foundReview) {
                ratingsNew.totalQuantity += 1;
                ratingsNew.quantities[foundReview.rating as keyof typeof ratingsNew.quantities] +=
                    1;
            }
        });

        ratingsNew.meanValue =
            Object.entries(ratingsNew.quantities).reduce((acc, [tier, count]) => {
                return acc + parseInt(tier, 10) * count;
            }, 0) / ratingsNew.totalQuantity;

        rating.meanValue = ratingsNew.meanValue;
        rating.totalQuantity = ratingsNew.totalQuantity;
        rating.quantities = ratingsNew.quantities;
    });
})();

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

export const generateSkeletonProductVariant = (): RecursivePartial<ProductVariant> => ({
    id: uuid(),
    name: uuid(),
    sku: uuid(),
    price: { base: 1000, current: 1000 },
    stock: 1000,
    options: { option: "value" },
    details: [
        { name: "Detail 1", value: "Value" },
        { name: "Detail 2", value: "Value" },
        { name: "Detail 3", value: "Value" },
    ],
    subscriptionDiscountPercentage: 0,
    releaseDate: new Date().toISOString(),
});

let skeletonProductId = 0;
export const generateSkeletonProduct = (): RecursivePartial<Product> => {
    skeletonProductId += 1;
    return {
        name: { full: `Product ${skeletonProductId}` },
        description: `${loremIpsum({
            paragraphLowerBound: 3,
            paragraphUpperBound: 9,
            sentenceLowerBound: 16,
            sentenceUpperBound: 40,
        })}`,
        slug: uuid(),
        images: {
            thumb: { src: "", alt: "" },
            dynamic: [
                { src: "a", alt: "" },
                { src: "b", alt: "" },
                { src: "c", alt: "" },
                { src: "d", alt: "" },
                { src: "e", alt: "" },
            ],
        },
        rating: {
            meanValue: 5.0,
            totalQuantity: 100,
            quantities: { 5: 90, 4: 6, 3: 2, 2: 1, 1: 1 },
        },
        allowance: 100,
        variants: Array.from({ length: 5 }).map(() => generateSkeletonProductVariant()),
        variantOptionOrder: ["option"],
        reviews: ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        releaseDate: new Date().toISOString(),
    };
};
