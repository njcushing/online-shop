import { CartItemData, PopulatedCart } from "@/utils/products/cart";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getCart: HTTPMethodTypes.GET<undefined, PopulatedCart> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<PopulatedCart>(`${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
    });

    return result;
};

export const updateCart: HTTPMethodTypes.PUT<
    undefined,
    { products: CartItemData[] },
    PopulatedCart
> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { products } = data.body || { products: [] };
    if (products.length === 0) {
        return { status: 400, message: "No products provided for query", data: null };
    }

    const result = await fetcher<PopulatedCart>(`${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "PUT",
        mode: "cors",
        headers: { Authorization: token },
        body: JSON.stringify({ products }),
    });

    return result;
};
