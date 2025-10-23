import { useContext, useMemo } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { Progress } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { Truck } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function DeliveryProgress() {
    const { settings } = useContext(RootContext);
    const { cart } = useContext(UserContext);

    let settingsData = { freeExpressDeliveryThreshold: 0 };
    let cartData = null;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "settings", context: settings },
            { name: "cart", context: cart },
        ],
    });

    if (!awaitingAny) {
        if (data.settings) settingsData = data.settings;
        if (data.cart) cartData = data.cart;
    }

    const cartSubtotalInformation = useMemo(
        () => calculateCartSubtotal(cartData || { items: [], promotions: [] }),
        [cartData],
    );
    const { total } = cartSubtotalInformation.cost;
    const meetsThreshold = total >= settingsData.freeExpressDeliveryThreshold;

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
                        over £
                        {
                            +parseFloat(
                                `${settingsData.freeExpressDeliveryThreshold / 100}`,
                            ).toFixed(2)
                        }
                        ! Add another{" "}
                        <b style={{ fontWeight: "bold" }}>
                            £
                            {((settingsData.freeExpressDeliveryThreshold - total) / 100).toFixed(2)}
                        </b>{" "}
                        to your order to qualify.
                    </span>
                    <Progress
                        value={
                            awaitingAny
                                ? (total / settingsData.freeExpressDeliveryThreshold) * 100
                                : 0
                        }
                        className={styles["delivery-progress-bar"]}
                    />
                </>
            )}
        </div>
    );
}
