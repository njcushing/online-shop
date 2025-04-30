import { Product, products } from "@/utils/products/product";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getProduct: HTTPMethodTypes.GET<{ productId?: string }, Product> = async (data) => {
    const { productId } = data.params || { productId: null };
    if (!productId) return { status: 400, message: "No product id provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/product/${productId}`, {
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

    const foundProduct = products.find((product) => product.id === productId);

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
