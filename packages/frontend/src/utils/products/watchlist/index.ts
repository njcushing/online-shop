import { Product, ProductVariant } from "@/utils/products/product";

export type Watchlist = {
    userId: string;
    productId: Product["id"];
    variantId: ProductVariant["id"];
};

export type UserWatchlist = Pick<Watchlist, "productId" | "variantId">[];

export const watchlists: Watchlist[] = [
    { userId: "1", productId: "1", variantId: "1-1" },
    { userId: "1", productId: "1", variantId: "1-2" },
    { userId: "1", productId: "2", variantId: "2-2" },
    { userId: "1", productId: "2", variantId: "2-3" },
    { userId: "1", productId: "3", variantId: "3-1" },
];
