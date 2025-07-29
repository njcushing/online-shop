import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { SubscriptionSummary } from "./components/SubscriptionSummary";
import styles from "./index.module.css";

export function Subscriptions() {
    const { subscriptions, defaultData } = useContext(UserContext);

    const data =
        subscriptions.data ||
        (defaultData.subscriptions as NonNullable<IUserContext["subscriptions"]["data"]>);

    return data && data.length > 0 ? (
        <ul className={styles["subscriptions"]}>
            {data.map((subscription) => {
                const { id } = subscription;

                return <SubscriptionSummary data={subscription} key={id} />;
            })}
        </ul>
    ) : (
        <p className={styles["no-subscriptions-message"]}>Nothing to show!</p>
    );
}
