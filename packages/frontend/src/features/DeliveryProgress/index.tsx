import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { Progress } from "@mantine/core";
import { calculateSubtotal } from "@/utils/products/cart";
import { settings } from "@settings";
import { Truck } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function DeliveryProgress() {
    const { cart } = useContext(UserContext);

    const subtotal = useMemo(() => calculateSubtotal(cart.data || []), [cart]);
    const meetsThreshold = useMemo(() => subtotal >= settings.freeDeliveryThreshold, [subtotal]);

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
                            £{((settings.freeDeliveryThreshold - subtotal) / 100).toFixed(2)}
                        </b>{" "}
                        to your order to qualify.
                    </span>
                    <Progress
                        value={(subtotal / settings.freeDeliveryThreshold) * 100}
                        className={styles["delivery-progress-bar"]}
                    />
                </>
            )}
        </div>
    );
}
