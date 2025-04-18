import { products as productData } from "@/utils/products/product";
import { CartItemData, PopulatedCartItemData, mockCart } from "@/utils/products/cart";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getCart: HTTPMethodTypes.GET<
    undefined,
    { cartData: PopulatedCartItemData[] }
> = async (data, abortController) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: null,
            };
        });
    return result;
};

export const mockGetCart = (): PopulatedCartItemData[] => {
    return mockCart.flatMap((cartItem) => {
        const { productId, variantId, quantity } = cartItem;
        const matchedProduct = productData.find((product) => product.id === productId);
        if (!matchedProduct) return [];
        const matchedVariant = matchedProduct.variants.find((variant) => variant.id === variantId);
        if (!matchedVariant) return [];
        return { product: matchedProduct, variant: matchedVariant, quantity };
    });
};

export const updateCart: HTTPMethodTypes.PUT<
    undefined,
    { products: CartItemData[] },
    { cartData: PopulatedCartItemData[] }
> = async (data, abortController) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { products } = data.body || { products: [] };
    if (products.length === 0) {
        return { status: 400, message: "No products provided for query", data: null };
    }

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`, {
        signal: abortController ? abortController.signal : null,
        method: "PUT",
        mode: "cors",
        headers: { Authorization: token },
        body: JSON.stringify({ products }),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: null,
            };
        });
    return result;
};
