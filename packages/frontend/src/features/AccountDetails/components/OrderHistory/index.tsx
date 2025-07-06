import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { OrderSummary } from "./components/OrderSummary";
import styles from "./index.module.css";

export function OrderHistory() {
    const { orders, defaultData } = useContext(UserContext);

    const data = orders.data || (defaultData.orders as NonNullable<IUserContext["orders"]["data"]>);

    return data && data.length > 0 ? (
        <ul className={styles["order-history"]}>
            {data.map((order) => {
                const { id } = order;

                return <OrderSummary data={order} key={id} />;
            })}
        </ul>
    ) : (
        <p className={styles["no-order-history-message"]}>Nothing to show!</p>
    );
}
