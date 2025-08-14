import { CartItemData, mockCart } from "@/utils/products/cart";
import { ProductVariant } from "@/utils/products/product";
import { OrderDataBase } from "@/utils/products/orders";
import { SubscriptionDataBase } from "@/utils/products/subscriptions";
import { DeepRequired } from "react-hook-form";
import { defaultProfile, Profile } from "../profile";

export type User = {
    profile: Profile;
    cart: CartItemData[];
    watchlist: ProductVariant["id"][];
    orders: OrderDataBase["id"][];
    subscriptions: SubscriptionDataBase["id"][];
};

export const defaultUser: DeepRequired<User> = {
    profile: defaultProfile,
    cart: mockCart,
    watchlist: ["1-1", "1-2", "2-2", "3-1", "3-3"],
    orders: ["1", "2", "3", "4", "5"],
    subscriptions: ["1", "2", "3", "4", "5", "6"],
};
