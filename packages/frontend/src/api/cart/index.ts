import { products } from "@/utils/products/product";
import { PopulatedCartItemData, mockCart } from "@/utils/products/cart";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export type Params = {
    accountId: string;
};

export type Response = {
    cartData: PopulatedCartItemData[];
};

export const getPopulatedCartItemData: HTTPMethodTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { accountId } = data.params as Params;
    if (!accountId) return { status: 400, message: "No accountId provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${accountId}/cart`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: {
            Authorization: localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION) || "",
        },
        body: JSON.stringify({ populated: true }),
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data ? responseJSON.data._id : null,
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

export const mockGetPopulatedCartItemData = (): PopulatedCartItemData[] => {
    return mockCart.flatMap((cartItem) => {
        const { productId, variantId, quantity } = cartItem;
        const matchedProduct = products.find((product) => product.id === productId);
        if (!matchedProduct) return [];
        const matchedVariant = matchedProduct.variants.find((variant) => variant.id === variantId);
        if (!matchedVariant) return [];
        return { product: matchedProduct, variant: matchedVariant, quantity };
    });
};
