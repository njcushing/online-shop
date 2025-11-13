import { ResponseBody as GetProductBySlugResponseDto } from "@/api/product/[slug]/GET";
import { mockProducts } from "@/utils/products/product";
import { defaultProfile } from "@/utils/schemas/profile";
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
        products: number;
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
        product: GetProductBySlugResponseDto;
        variant: GetProductBySlugResponseDto["variants"][number];
    })[];
};

export const generateSkeletonOrderList = (length: number = 5): RecursivePartial<OrderData>[] => {
    return Array.from({
        length,
    }).map((v, i) => {
        const pickProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const pickVariant =
            pickProduct.variants[Math.floor(Math.random() * pickProduct.variants.length)];

        const product = {
            quantity: 1,
            cost: (() => {
                const unit = Math.floor(Math.random() * 2000) + 1000;

                return {
                    unit,
                    paid: unit * 0.8,
                };
            })(),
            product: pickProduct,
            variant: pickVariant,
        };

        return {
            id: `${i + 1}`,
            orderNo: ulid(),
            status: statuses[0],
            userId: "1",
            cost: {
                total: product.cost.paid,
                products: product.cost.paid,
                postage: 0,
            },
            products: [product],
            orderDate: new Date().toISOString(),
            deliveryAddress: defaultProfile.addresses.delivery,
            billingAddress: defaultProfile.addresses.billing,
            paymentMethod: paymentMethods[0],
            deliveryInfo: {
                expectedDate: new Date().toISOString(),
                deliveredDate: undefined,
                trackingNumber: undefined,
            },
        };
    });
};
