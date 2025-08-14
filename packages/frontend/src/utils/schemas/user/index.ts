import { OrderDataBase } from "@/utils/products/orders";
import { CartItemData, mockCart } from "@/utils/products/cart";
import { SubscriptionDataBase } from "@/utils/products/subscriptions";
import { DeepRequired } from "react-hook-form";
import { defaultProfile, Profile } from "../profile";

export type User = {
    profile: Profile;
    cart: CartItemData[];
    orders: OrderDataBase["id"][];
    subscriptions: SubscriptionDataBase["id"][];
};

export const defaultUser: DeepRequired<User> = {
    profile: defaultProfile,
    cart: mockCart,
    orders: ["1", "2", "3", "4", "5"],
    subscriptions: ["1", "2", "3", "4", "5", "6"],
};
