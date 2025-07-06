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

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof statuses)[number];

const paymentMethods = ["card", "paypal", "bank_transfer", "gift_card"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export type OrderDataBase = {
    id: string;
    orderNo: string;
    status: OrderStatus;
    userId: string;
    quantity: number;
    cost: {
        unit: number;
        postage: number;
        paid: number;
    };
    orderDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
    paymentMethod: PaymentMethod;
    trackingNumber?: string;
};

export type OrderData = OrderDataBase & {
    productId: Product["id"];
    variantId: Product["variants"][number]["id"];
};

export type PopulatedOrderData = OrderDataBase & {
    product: Product;
    variant: ProductVariant;
};

export const mockOrders: OrderData[] = [
    {
        id: "1",
        orderNo: ulid(),
        status: "pending",
        userId: "1",
        quantity: 3,
        cost: { unit: 700, postage: 0, paid: 1899 },
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "card",
        trackingNumber: undefined,

        productId: "1",
        variantId: "1-1",
    },
    {
        id: "2",
        orderNo: ulid(),
        status: "paid",
        userId: "1",
        quantity: 14,
        cost: { unit: 700, postage: 0, paid: 8199 },
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "card",
        trackingNumber: undefined,

        productId: "1",
        variantId: "1-3",
    },
    {
        id: "3",
        orderNo: ulid(),
        status: "shipped",
        userId: "1",
        quantity: 18,
        cost: { unit: 1250, postage: 0, paid: 20099 },
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "paypal",
        trackingNumber: undefined,

        productId: "2",
        variantId: "2-1",
    },
    {
        id: "4",
        orderNo: ulid(),
        status: "delivered",
        userId: "1",
        quantity: 6,
        cost: { unit: 1250, postage: 0, paid: 7099 },
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "bank_transfer",
        trackingNumber: undefined,

        productId: "2",
        variantId: "2-3",
    },
    {
        id: "5",
        orderNo: ulid(),
        status: "cancelled",
        userId: "1",
        quantity: 22,
        cost: { unit: 2250, postage: 0, paid: 43099 },
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "gift_card",
        trackingNumber: undefined,

        productId: "3",
        variantId: "3-1",
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
        status: statuses[Math.floor(Math.random() * statuses.length)],
        userId: "1",
        quantity: 1,
        cost: (() => {
            const unit = Math.floor(Math.random() * 2000) + 1000;

            return {
                unit,
                postage: 0,
                paid: unit * Math.random() * 0.2 + 0.8,
            };
        })(),
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        trackingNumber: undefined,

        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
    }));
};
