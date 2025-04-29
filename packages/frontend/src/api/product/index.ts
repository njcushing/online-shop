import { Product, products } from "@/utils/products/product";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getProduct: HTTPMethodTypes.GET<{ productSlug?: string }, Product> = async (data) => {
    const { productSlug } = data.params || { productSlug: null };
    if (!productSlug)
        return { status: 400, message: "No product slug provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/product/${productSlug}`, {
        signal: data.abortController ? data.abortController.signal : null,
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

export const mockGetProduct: HTTPMethodTypes.GET<{ productSlug?: string }, Product> = async (
    data,
) => {
    const { params } = data;
    const { productSlug } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!productSlug) {
        return {
            status: 400,
            message: "No product slug provided for query",
            data: null,
        };
    }

    const foundProduct = products.find((product) => product.slug === productSlug);

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
