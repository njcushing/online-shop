import { useContext, useMemo } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { Progress } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { Truck } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function DeliveryProgress() {
    const { settings } = useContext(RootContext);
    const { cart } = useContext(UserContext);

    const { response: settingsResponse, awaiting: settingsAwaiting } = settings;
    const { response: cartResponse, awaiting: cartAwaiting } = cart;

    const { success: settingsSuccess } = settingsResponse;
    const { success: cartSuccess } = cartResponse;

    const awaitingAny = settingsAwaiting || cartAwaiting;

    let settingsData = { freeExpressDeliveryThreshold: 0 };
    let cartData = null;

    if (!awaitingAny) {
        if (!settingsSuccess) throw new Error(settingsResponse.message);
        if (!cartSuccess) throw new Error(cartResponse.message);

        settingsData = settingsResponse.data;
        cartData = cartResponse.data;
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
