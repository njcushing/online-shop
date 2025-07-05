import {
    ProductVariant,
    Product,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { defaultAccountDetails } from "@/utils/schemas/account";
import { Address } from "@/utils/schemas/address";
import { RecursivePartial } from "@/utils/types";
import { ulid } from "ulid";

export type OrderData = {
    id: string;
    orderNo: string;
    productId: Product["id"];
    variantId: Product["variants"][number]["id"];
    quantity: number;
    cost: number;
    orderDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
};

export type PopulatedOrderData = {
    id: string;
    orderNo: string;
    product: Product;
    variant: ProductVariant;
    quantity: number;
    cost: number;
    orderDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
};

export const mockOrders: OrderData[] = [
    {
        id: "1",
        orderNo: ulid(),
        productId: "1",
        variantId: "1-1",
        quantity: 3,
        cost: 1029,
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
    },
    {
        id: "2",
        orderNo: ulid(),
        productId: "1",
        variantId: "1-3",
        quantity: 14,
        cost: 3009,
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
    },
    {
        id: "3",
        orderNo: ulid(),
        productId: "2",
        variantId: "2-1",
        quantity: 18,
        cost: 989,
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
    },
    {
        id: "4",
        orderNo: ulid(),
        productId: "2",
        variantId: "2-3",
        quantity: 6,
        cost: 1099,
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
    },
    {
        id: "5",
        orderNo: ulid(),
        productId: "3",
        variantId: "3-1",
        quantity: 22,
        cost: 2019,
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
    },
];

export const generateSkeletonOrderList = (
    length: number = 5,
): RecursivePartial<PopulatedOrderData>[] => {
    return Array.from({
        length,
    }).map((v, i) => ({
        id: `${i + 1}`,
        orderNo: ulid(),
        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
        quantity: 1,
        cost: Math.floor(Math.random() * 2000) + 1000,
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
    }));
};
