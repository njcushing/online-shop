import { products } from "@/utils/products/product";
import { PopulatedCartItemData, mockCart } from "@/utils/products/cart";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getPopulatedCartItemData: HTTPMethodTypes.GET<
    undefined,
    { cartData: PopulatedCartItemData[] }
> = async (data, abortController = null) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
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
