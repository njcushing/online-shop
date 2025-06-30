import { ProductReview, Product, reviews, products as productData } from "@/utils/products/product";
import { CartItemData, PopulatedCartItemData, mockCart } from "@/utils/products/cart";
import { UserWatchlist, watchlists } from "@/utils/products/watchlist";
import { filterOptions, sortOptions } from "@/features/ProductReviews";
import { AccountDetails, defaultAccountDetails } from "@/utils/schemas/account";
import * as HTTPMethodTypes from "./types";

export const mockGetAccountDetails: HTTPMethodTypes.GET<undefined, AccountDetails> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundAccountDetails = defaultAccountDetails;

    if (!foundAccountDetails) {
        return {
            status: 404,
            message: "Account details not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundAccountDetails,
    };
};

export const mockPopulateCartItems = (cart: CartItemData[]): PopulatedCartItemData[] => {
    return cart.flatMap((cartItem) => {
        const { productId, variantId, quantity } = cartItem;
        const matchedProduct = productData.find((product) => product.id === productId);
        if (!matchedProduct) return [];
        const matchedVariant = matchedProduct.variants.find((variant) => variant.id === variantId);
        if (!matchedVariant) return [];
        return { product: matchedProduct, variant: matchedVariant, quantity };
    });
};

export const mockGetCart: HTTPMethodTypes.GET<undefined, PopulatedCartItemData[]> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundCart = mockPopulateCartItems(mockCart);

    if (!foundCart) {
        return {
            status: 404,
            message: "Cart not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundCart,
    };
};

export const mockUpdateCart: HTTPMethodTypes.PUT<
    undefined,
    { products: CartItemData[] },
    PopulatedCartItemData[]
> = async (data) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { products } = data.body || { products: [] };
    if (products.length === 0) {
        return { status: 400, message: "No products provided for query", data: null };
    }

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const updatedCart = structuredClone(mockCart);

    products.forEach(async (productToUpdate) => {
        const { productId, variantId, quantity } = productToUpdate;

        const existingEntryIndex = updatedCart.findIndex((cartItem) => {
            return cartItem.productId === productId && cartItem.variantId === variantId;
        });
        if (existingEntryIndex >= 0) {
            if (updatedCart[existingEntryIndex].quantity + quantity <= 0) {
                updatedCart.splice(existingEntryIndex, 1);
            } else {
                updatedCart[existingEntryIndex].quantity += quantity;
            }
        } else {
            const foundProduct = await mockGetProduct({ params: { productId } });
            if (!foundProduct || !foundProduct.data) return;
            const variant = foundProduct.data.variants.find(
                (productVariant) => productVariant.id === variantId,
            );
            if (!variant) return;

            updatedCart.push(productToUpdate);
        }
    });

    return {
        status: 200,
        message: "Success",
        data: mockPopulateCartItems(updatedCart),
    };
};

export const mockGetProduct: HTTPMethodTypes.GET<{ productId?: string }, Product> = async (
    data,
) => {
    const { params } = data;
    const { productId } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!productId) {
        return {
            status: 400,
            message: "No product id provided for query",
            data: null,
        };
    }

    const foundProduct = productData.find((product) => product.id === productId);

    if (!foundProduct) {
        return {
            status: 404,
            message: "Product not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundProduct as Product,
    };
};

export const mockGetReview: HTTPMethodTypes.GET<{ reviewId: string }, ProductReview> = async (
    data,
) => {
    const { params } = data;
    const { reviewId } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!reviewId) {
        return {
            status: 400,
            message: "No review id provided for query",
            data: null,
        };
    }

    const foundReview = reviews.find((review) => review.id === reviewId);

    if (!foundReview) {
        return {
            status: 404,
            message: "Review not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundReview,
    };
};

export const mockGetReviews: HTTPMethodTypes.GET<
    {
        productId?: string;
        filter?: (typeof filterOptions)[number];
        sort?: (typeof sortOptions)[number];
        start?: number;
        end?: number;
    },
    ProductReview[]
> = async (data) => {
    const { params } = data;
    const { productId, filter, sort, start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!productId) {
        return {
            status: 400,
            message: "No product id provided for query",
            data: [],
        };
    }

    const productReviews = reviews.filter((review) => review.productId === productId);

    let filteredReviews = productReviews;
    if (filter) {
        filteredReviews = filteredReviews.filter(
            (review) => review.rating === Number.parseInt(filter, 10),
        );
    }

    const sortedReviews = filteredReviews;
    if (sort) {
        switch (sort) {
            case "Most Recent":
                sortedReviews.sort(
                    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
                );
                break;
            case "Highest Rating":
                // Sort by recency first
                sortedReviews.sort(
                    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
                );
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case "Lowest Rating":
                // Sort by recency first
                sortedReviews.sort(
                    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
                );
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            default:
        }
    }

    let slicedReviews = sortedReviews;
    slicedReviews = slicedReviews.slice(start, end);

    return {
        status: 200,
        message: "Success",
        data: slicedReviews,
    };
};

export const mockGetWatchlist: HTTPMethodTypes.GET<undefined, UserWatchlist> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const userWatchlist = watchlists.flatMap((watchlist) => {
        const { userId, productId, variantId } = watchlist;
        return userId === "1" ? { productId, variantId } : [];
    });

    return {
        status: 200,
        message: "Success",
        data: userWatchlist,
    };
};
