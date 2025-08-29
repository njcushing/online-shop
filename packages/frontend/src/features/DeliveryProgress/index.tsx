import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { Progress } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { settings } from "@settings";
import { Truck } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function DeliveryProgress() {
    const { cart } = useContext(UserContext);
    const { response } = cart;
    const { data } = response;

    const cartSubtotalInformation = useMemo(
        () => calculateCartSubtotal(data || { items: [], promotions: [] }),
        [data],
    );
    const { total } = cartSubtotalInformation.cost;
    const meetsThreshold = useMemo(() => total >= settings.freeDeliveryThreshold, [total]);

    return (
        <div className={styles["delivery-progress"]} data-meets-threshold={meetsThreshold}>
            <Truck size={28} color="black" />
            {meetsThreshold ? (
                <span className={styles["delivery-progress-status-message"]}>
                    {`You've qualified for free delivery!`}
                </span>
            ) : (
                <>
                    <span className={styles["delivery-progress-status-message"]}>
                        <b style={{ fontWeight: "bold" }}>Free</b> standard delivery on all orders
                        over £{+parseFloat(`${settings.freeDeliveryThreshold / 100}`).toFixed(2)}!
                        Add another{" "}
                        <b style={{ fontWeight: "bold" }}>
                            £{((settings.freeDeliveryThreshold - total) / 100).toFixed(2)}
                        </b>{" "}
                        to your order to qualify.
                    </span>
                    <Progress
                        value={(total / settings.freeDeliveryThreshold) * 100}
                        className={styles["delivery-progress-bar"]}
                    />
                </>
            )}
        </div>
    );
}
