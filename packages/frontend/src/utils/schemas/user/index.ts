import { OrderDataBase } from "@/utils/products/orders";
import { SubscriptionDataBase } from "@/utils/products/subscriptions";
import { DeepRequired } from "react-hook-form";
import { defaultProfile, Profile } from "../profile";

export type User = {
    profile: Profile;
    orders: OrderDataBase["id"][];
    subscriptions: SubscriptionDataBase["id"][];
};

export const defaultUser: DeepRequired<User> = {
    profile: defaultProfile,
    orders: ["1", "2", "3", "4", "5"],
    subscriptions: ["1", "2", "3", "4", "5", "6"],
};
