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

export type OrderProductData = {
    quantity: number;
    cost: {
        unit: number;
        paid: number;
    };
};

export type OrderDataBase = {
    id: string;
    orderNo: string;
    status: OrderStatus;
    userId: string;
    cost: {
        total: number;
        postage: number;
    };
    orderDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
    paymentMethod: PaymentMethod;
    deliveryInfo: {
        expectedDate: string;
        deliveredDate?: string;
        trackingNumber?: string;
    };
};

export type OrderData = OrderDataBase & {
    products: (OrderProductData & {
        productId: Product["id"];
        variantId: Product["variants"][number]["id"];
    })[];
};

export type PopulatedOrderData = OrderDataBase & {
    products: (OrderProductData & {
        product: Product;
        variant: ProductVariant;
    })[];
};

export const mockOrders: OrderData[] = [
    {
        id: "1",
        orderNo: ulid(),
        status: "pending",
        userId: "1",
        cost: {
            total: 1899,
            postage: 0,
        },
        products: [
            {
                quantity: 3,
                cost: { unit: 700, paid: 1899 },
                productId: "1",
                variantId: "1-1",
            },
            {
                quantity: 8,
                cost: { unit: 700, paid: 5600 },
                productId: "1",
                variantId: "1-2",
            },
        ],
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "card",
        deliveryInfo: {
            expectedDate: new Date().toISOString(),
            deliveredDate: undefined,
            trackingNumber: undefined,
        },
    },
    {
        id: "2",
        orderNo: ulid(),
        status: "paid",
        userId: "1",
        cost: {
            total: 8199,
            postage: 0,
        },
        products: [
            {
                quantity: 14,
                cost: { unit: 700, paid: 8199 },
                productId: "1",
                variantId: "1-3",
            },
        ],
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "card",
        deliveryInfo: {
            expectedDate: new Date().toISOString(),
            deliveredDate: undefined,
            trackingNumber: undefined,
        },
    },
    {
        id: "3",
        orderNo: ulid(),
        status: "shipped",
        userId: "1",
        cost: {
            total: 20099,
            postage: 0,
        },
        products: [
            {
                quantity: 18,
                cost: { unit: 1250, paid: 20099 },
                productId: "2",
                variantId: "2-1",
            },
        ],
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "paypal",
        deliveryInfo: {
            expectedDate: new Date().toISOString(),
            deliveredDate: undefined,
            trackingNumber: undefined,
        },
    },
    {
        id: "4",
        orderNo: ulid(),
        status: "delivered",
        userId: "1",
        cost: {
            total: 7099,
            postage: 0,
        },
        products: [
            {
                quantity: 6,
                cost: { unit: 1250, paid: 7099 },
                productId: "2",
                variantId: "2-3",
            },
        ],
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "bank_transfer",
        deliveryInfo: {
            expectedDate: new Date().toISOString(),
            deliveredDate: new Date().toISOString(),
            trackingNumber: undefined,
        },
    },
    {
        id: "5",
        orderNo: ulid(),
        status: "cancelled",
        userId: "1",
        cost: {
            total: 43099,
            postage: 0,
        },
        products: [
            {
                quantity: 22,
                cost: { unit: 2250, paid: 43099 },
                productId: "3",
                variantId: "3-1",
            },
        ],
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: "gift_card",
        deliveryInfo: {
            expectedDate: new Date().toISOString(),
            deliveredDate: undefined,
            trackingNumber: undefined,
        },
    },
];

export const generateSkeletonOrderList = (
    length: number = 5,
): RecursivePartial<PopulatedOrderData>[] => {
    const product = {
        quantity: 1,
        cost: (() => {
            const unit = Math.floor(Math.random() * 2000) + 1000;

            return {
                unit,
                paid: unit * 0.8,
            };
        })(),
        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
    };

    return Array.from({
        length,
    }).map((v, i) => ({
        id: `${i + 1}`,
        orderNo: ulid(),
        status: statuses[0],
        userId: "1",
        cost: {
            total: product.cost.paid,
            postage: 0,
        },
        products: [product],
        orderDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        paymentMethod: paymentMethods[0],
        deliveryInfo: {
            expectedDate: new Date().toISOString(),
            deliveredDate: undefined,
            trackingNumber: undefined,
        },
    }));
};
