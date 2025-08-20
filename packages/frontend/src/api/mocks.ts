import { ProductReview, Product, reviews, products as productData } from "@/utils/products/product";
import { CartItemData, Cart, PopulatedCart, mockCart } from "@/utils/products/cart";
import { OrderData, PopulatedOrderData, mockOrders } from "@/utils/products/orders";
import {
    SubscriptionData,
    PopulatedSubscriptionData,
    mockSubscriptions,
} from "@/utils/products/subscriptions";
import { filterOptions as reviewFilterOptions, sortOptions } from "@/features/ProductReviews";
import { FilterOption as OrderFilterOption } from "@/features/AccountDetails/components/OrderHistory";
import { User, defaultUser } from "@/utils/schemas/user";
import { Profile, defaultProfile } from "@/utils/schemas/profile";
import dayjs from "dayjs";
import * as HTTPMethodTypes from "./types";

export const mockGetUser: HTTPMethodTypes.GET<undefined, User> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundUser = defaultUser;

    if (!foundUser) {
        return {
            status: 404,
            message: "User not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundUser,
    };
};

export const mockGetProfile: HTTPMethodTypes.GET<undefined, Profile> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundProfile = defaultProfile;

    if (!foundProfile) {
        return {
            status: 404,
            message: "Profile not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundProfile,
    };
};

export const mockPopulateCartItems = (cart: Cart): PopulatedCart => {
    const populatedItems = cart.items.flatMap((cartItem) => {
        const { productId, variantId } = cartItem;
        const matchedProduct = productData.find((product) => product.id === productId);
        if (!matchedProduct) return [];
        const matchedVariant = matchedProduct.variants.find((variant) => variant.id === variantId);
        if (!matchedVariant) return [];
        return { ...cartItem, product: matchedProduct, variant: matchedVariant };
    });

    return { ...cart, items: populatedItems };
};

export const mockGetCart: HTTPMethodTypes.GET<undefined, PopulatedCart> = async () => {
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
    PopulatedCart
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

        const existingEntryIndex = updatedCart.items.findIndex((cartItem) => {
            return cartItem.productId === productId && cartItem.variantId === variantId;
        });
        if (existingEntryIndex >= 0) {
            if (updatedCart.items[existingEntryIndex].quantity + quantity <= 0) {
                updatedCart.items.splice(existingEntryIndex, 1);
            } else {
                updatedCart.items[existingEntryIndex].quantity += quantity;
            }
        } else {
            const foundProduct = await mockGetProduct({ params: { productId } });
            if (!foundProduct || !foundProduct.data) return;
            const variant = foundProduct.data.variants.find(
                (productVariant) => productVariant.id === variantId,
            );
            if (!variant) return;

            updatedCart.items.push(productToUpdate);
        }
    });

    return {
        status: 200,
        message: "Success",
        data: mockPopulateCartItems(updatedCart),
    };
};

export const mockPopulateOrders = (orders: OrderData[]): PopulatedOrderData[] => {
    return orders.flatMap((order) => {
        const { products } = order;
        const matchedProducts = products.flatMap((product) => {
            const { productId, variantId } = product;

            const matchedProduct = productData.find((p) => p.id === productId);
            if (!matchedProduct) return [];
            const matchedVariant = matchedProduct.variants.find((v) => v.id === variantId);
            if (!matchedVariant) return [];

            return { ...product, product: matchedProduct, variant: matchedVariant };
        });
        return { ...order, products: matchedProducts };
    });
};

export const mockGetOrders: HTTPMethodTypes.GET<
    {
        filter?: OrderFilterOption;
        start?: number;
        end?: number;
    },
    { quantity: number; orders: PopulatedOrderData[] }
> = async (data) => {
    const { params } = data;
    const { filter, start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundOrders = mockPopulateOrders(mockOrders);

    if (!foundOrders) {
        return {
            status: 404,
            message: "Orders not found",
            data: null,
        };
    }

    let filteredOrders = foundOrders;
    switch (filter) {
        case "1_month":
            filteredOrders = filteredOrders.filter((order) => {
                return dayjs(new Date()).subtract(1, "month") <= dayjs(order.orderDate);
            });
            break;
        case "3_months":
            filteredOrders = filteredOrders.filter((order) => {
                return dayjs(new Date()).subtract(3, "month") <= dayjs(order.orderDate);
            });
            break;
        case "6_months":
            filteredOrders = filteredOrders.filter((order) => {
                return dayjs(new Date()).subtract(6, "month") <= dayjs(order.orderDate);
            });
            break;
        case "1_year":
            filteredOrders = filteredOrders.filter((order) => {
                return dayjs(new Date()).subtract(1, "year") <= dayjs(order.orderDate);
            });
            break;
        case "2_years":
            filteredOrders = filteredOrders.filter((order) => {
                return dayjs(new Date()).subtract(2, "year") <= dayjs(order.orderDate);
            });
            break;
        case "3_years":
            filteredOrders = filteredOrders.filter((order) => {
                return dayjs(new Date()).subtract(3, "year") <= dayjs(order.orderDate);
            });
            break;
        default:
    }

    const quantity = filteredOrders.length;

    let slicedOrders = filteredOrders;
    slicedOrders = slicedOrders.slice(start, end);

    return {
        status: 200,
        message: "Success",
        data: { quantity, orders: slicedOrders },
    };
};

export const mockPopulateSubscriptions = (
    subscriptions: SubscriptionData[],
): PopulatedSubscriptionData[] => {
    return subscriptions.flatMap((subscription) => {
        const { productId, variantId } = subscription;
        const matchedProduct = productData.find((product) => product.id === productId);
        if (!matchedProduct) return [];
        const matchedVariant = matchedProduct.variants.find((variant) => variant.id === variantId);
        if (!matchedVariant) return [];
        const populatedSubscription = {
            ...subscription,
            product: matchedProduct,
            variant: matchedVariant,
        };
        return populatedSubscription;
    });
};

export const mockGetSubscriptions: HTTPMethodTypes.GET<
    {
        start?: number;
        end?: number;
    },
    PopulatedSubscriptionData[]
> = async (data) => {
    const { params } = data;
    const { start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundSubscriptions = mockPopulateSubscriptions(mockSubscriptions);

    if (!foundSubscriptions) {
        return {
            status: 404,
            message: "Subscriptions not found",
            data: null,
        };
    }

    const slicedSubscriptions = foundSubscriptions.slice(start, end);

    return {
        status: 200,
        message: "Success",
        data: slicedSubscriptions,
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
        filter?: (typeof reviewFilterOptions)[number];
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
