import { Product, products } from "@/utils/products/product";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export type Params = {
    productSlug: string;
};

export type Response = {
    product: Product | null;
};

export const getProductDataFromSlug: HTTPMethodTypes.GET<Params, Response> = async (
    data,
    abortController = null,
) => {
    const { productSlug } = data.params as Params;
    if (!productSlug)
        return { status: 400, message: "No product slug provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/product/${productSlug}`, {
        signal: abortController ? abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: {
            Authorization: localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION) || "",
        },
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

export const mockGetProductDataFromSlug = (productSlug: string): Product | null => {
    return products.find((product) => product.slug === productSlug) || null;
};
