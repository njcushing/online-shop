import { PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import styles from "./index.module.css";

export type TSubscriptionSummary = {
    data: PopulatedSubscriptionData;
};

export function SubscriptionSummary({ data }: TSubscriptionSummary) {
    return <li className={styles["subscription-summary"]}></li>;
}
