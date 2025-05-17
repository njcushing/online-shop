import { products as productData } from "@/utils/products/product";
import { CartItemData, PopulatedCartItemData, mockCart } from "@/utils/products/cart";
import * as HTTPMethodTypes from "../types";
import { mockGetProduct } from "../product";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getCart: HTTPMethodTypes.GET<undefined, PopulatedCartItemData[]> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<PopulatedCartItemData[]>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
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

export const updateCart: HTTPMethodTypes.PUT<
    undefined,
    { products: CartItemData[] },
    PopulatedCartItemData[]
> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { products } = data.body || { products: [] };
    if (products.length === 0) {
        return { status: 400, message: "No products provided for query", data: null };
    }

    const result = await fetcher<PopulatedCartItemData[]>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/cart`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "PUT",
            mode: "cors",
            headers: { Authorization: token },
            body: JSON.stringify({ products }),
        },
    );

    return result;
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
