import {
    ProductVariant,
    Product,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";

export type OrderData = {
    productId: Product["id"];
    variantId: Product["variants"][number]["id"];
    quantity: number;
    orderDate: string;
};

export type PopulatedOrderData = {
    product: Product;
    variant: ProductVariant;
    quantity: number;
    orderDate: string;
};

export const mockOrders: OrderData[] = [
    { productId: "1", variantId: "1-1", quantity: 3, orderDate: new Date().toISOString() },
    { productId: "1", variantId: "1-3", quantity: 14, orderDate: new Date().toISOString() },
    { productId: "2", variantId: "2-1", quantity: 18, orderDate: new Date().toISOString() },
    { productId: "2", variantId: "2-3", quantity: 6, orderDate: new Date().toISOString() },
    { productId: "3", variantId: "3-1", quantity: 22, orderDate: new Date().toISOString() },
];

export const generateSkeletonOrderList = (
    length: number = 5,
): RecursivePartial<PopulatedOrderData>[] => {
    return Array.from({
        length,
    }).map(() => ({
        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
        quantity: 1,
        orderDate: new Date().toISOString(),
    }));
};
