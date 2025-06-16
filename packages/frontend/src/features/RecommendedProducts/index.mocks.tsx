import { RecursivePartial } from "@/utils/types";
import { Product } from "@/utils/products/product";

export const mockProducts: RecursivePartial<Product>[] = [
    {
        id: "product1Id",
        slug: "product-1-id-slug",
        name: {
            full: "Product 1 Name Full",
            shorthands: [{ type: "quantity", value: "Product 1 Name Shorthand" }],
        },
        images: { thumb: { src: "product1ThumbImgSrc", alt: "product1ThumbImgAlt" }, dynamic: [] },
    },
    {
        id: "product2Id",
        slug: "product-2-id-slug",
        name: {
            full: "Product 2 Name Full",
            shorthands: [{ type: "quantity", value: "Product 2 Name Shorthand" }],
        },
        images: { thumb: { src: "product2ThumbImgSrc", alt: "product2ThumbImgAlt" }, dynamic: [] },
    },
    {
        id: "product3Id",
        slug: "product-3-id-slug",
        name: {
            full: "Product 3 Name Full",
            shorthands: [{ type: "quantity", value: "Product 3 Name Shorthand" }],
        },
        images: { thumb: { src: "product3ThumbImgSrc", alt: "product3ThumbImgAlt" }, dynamic: [] },
    },
];
