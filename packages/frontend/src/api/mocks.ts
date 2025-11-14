import { mockProducts } from "@/utils/products/product";
import { Cart, generateSkeletonCart } from "@/utils/products/cart";
import { OrderData, generateSkeletonOrderList } from "@/utils/products/orders";
import { SubscriptionData, generateSkeletonSubscriptionList } from "@/utils/products/subscriptions";
import { filterOptions as reviewFilterOptions, sortOptions } from "@/features/ProductReviews";
import { FilterOption as OrderFilterOption } from "@/features/AccountDetails/components/OrderHistory";
import { User, defaultUser } from "@/utils/schemas/user";
import { Profile, defaultProfile } from "@/utils/schemas/profile";
import dayjs from "dayjs";
import { ResponseBody as GetProductBySlugResponseDto } from "./products/[slug]/GET";
import * as HTTPMethodTypes from "./types";

export const mockGetUser: HTTPMethodTypes.GET<undefined, User> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const foundUser = defaultUser;

    if (!foundUser) {
        return {
            success: false,
            status: 404,
            message: "User not found",
            error: undefined,
        };
    }

    return {
        success: true,
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
            success: false,
            status: 404,
            message: "Profile not found",
            error: undefined,
        };
    }

    return {
        success: true,
        status: 200,
        message: "Success",
        data: foundProfile,
    };
};

export const mockGetCart: HTTPMethodTypes.GET<undefined, Cart> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    return {
        success: true,
        status: 200,
        message: "Success",
        data: generateSkeletonCart() as Cart,
    };
};

export const mockGetOrders: HTTPMethodTypes.GET<
    {
        filter?: OrderFilterOption;
        start?: number;
        end?: number;
    },
    { quantity: number; orders: OrderData[] }
> = async (data) => {
    const { params } = data;
    const { filter, start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    let filteredOrders = generateSkeletonOrderList() as OrderData[];
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
        success: true,
        status: 200,
        message: "Success",
        data: { quantity, orders: slicedOrders },
    };
};

export const mockGetSubscriptions: HTTPMethodTypes.GET<
    {
        start?: number;
        end?: number;
    },
    SubscriptionData[]
> = async (data) => {
    const { params } = data;
    const { start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const subscriptions = generateSkeletonSubscriptionList() as SubscriptionData[];

    const slicedSubscriptions = subscriptions.slice(start, end);

    return {
        success: true,
        status: 200,
        message: "Success",
        data: slicedSubscriptions,
    };
};

export const mockGetProductBySlug: HTTPMethodTypes.GET<
    { productSlug?: GetProductBySlugResponseDto["slug"] },
    GetProductBySlugResponseDto
> = async (data) => {
    const { params } = data;
    const { productSlug } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!productSlug) {
        return {
            success: false,
            status: 400,
            message: "No product slug provided for query",
            error: undefined,
        };
    }

    const foundProduct = mockProducts.find((p) => p.slug === productSlug);

    if (!foundProduct) {
        return {
            success: false,
            status: 404,
            message: "No product found with the specified slug",
            error: undefined,
        };
    }

    return {
        success: true,
        status: 200,
        message: "Success",
        data: foundProduct,
    };
};

export const mockGetReview: HTTPMethodTypes.GET<
    { reviewId: string },
    GetProductBySlugResponseDto["reviews"][number]
> = async (data) => {
    const { params } = data;
    const { reviewId } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!reviewId) {
        return {
            success: false,
            status: 400,
            message: "No review id provided for query",
            error: undefined,
        };
    }

    const reviews = mockProducts.flatMap((p) => p.reviews);
    const foundReview = reviews.find((r) => r.id === reviewId);

    if (!foundReview) {
        return {
            success: false,
            status: 404,
            message: "No review found with specified review id",
            error: undefined,
        };
    }

    return {
        success: true,
        status: 200,
        message: "Success",
        data: foundReview,
    };
};

export const mockGetReviews: HTTPMethodTypes.GET<
    {
        productSlug?: GetProductBySlugResponseDto["slug"];
        filter?: (typeof reviewFilterOptions)[number];
        sort?: (typeof sortOptions)[number];
        start?: number;
        end?: number;
    },
    GetProductBySlugResponseDto["reviews"]
> = async (data) => {
    const { params } = data;
    const { productSlug, filter, sort, start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!productSlug) {
        return {
            success: false,
            status: 400,
            message: "No product slug provided for query",
            error: undefined,
        };
    }

    const foundProduct = mockProducts.find((p) => p.slug === productSlug);

    if (!foundProduct) {
        return {
            success: false,
            status: 404,
            message: "No product found with the specified slug",
            error: undefined,
        };
    }

    let filteredReviews = foundProduct.reviews;
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
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                break;
            case "Highest Rating":
                // Sort by recency first
                sortedReviews.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case "Lowest Rating":
                // Sort by recency first
                sortedReviews.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            default:
        }
    }

    let slicedReviews = sortedReviews;
    slicedReviews = slicedReviews.slice(start, end);

    return {
        success: true,
        status: 200,
        message: "Success",
        data: slicedReviews,
    };
};
