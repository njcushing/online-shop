import { OrderDataBase } from "@/utils/products/orders";
import { SubscriptionDataBase } from "@/utils/products/subscriptions";
import { AccountDetails } from "../account";

export type User = {
    profile: AccountDetails;
    orders: OrderDataBase["id"][];
    subscriptions: SubscriptionDataBase["id"][];
};
