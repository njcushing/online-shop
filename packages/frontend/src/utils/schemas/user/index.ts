import { Consent } from "@/utils/schemas/consent";
import { Cart, mockCart } from "@/utils/products/cart";
import { ProductVariant } from "@/utils/products/product";
import { OrderDataBase } from "@/utils/products/orders";
import { SubscriptionDataBase } from "@/utils/products/subscriptions";
import { defaultProfile, Profile } from "../profile";

export type User = {
    consent: Consent;
    profile: Profile;
    cart: Cart;
    watchlist: ProductVariant["id"][];
    orders: OrderDataBase["id"][];
    subscriptions: SubscriptionDataBase["id"][];
};

export const defaultUser: User = {
    consent: { cookies: false, timestamp: null },
    profile: defaultProfile,
    cart: mockCart,
    watchlist: ["1-1", "1-2", "2-2", "3-1", "3-3"],
    orders: ["1", "2", "3", "4", "5"],
    subscriptions: ["1", "2", "3", "4", "5", "6"],
};
