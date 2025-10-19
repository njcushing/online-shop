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

    let settingsData = null;
    let cartData = null;

    if (!awaitingAny) {
        if (!settingsSuccess) throw new Error("Settings not found");
        if (!cartSuccess) throw new Error("Cart not found");

        settingsData = settingsResponse.data;
        cartData = cartResponse.data;
    }

    const cartSubtotalInformation = useMemo(
        () => calculateCartSubtotal(cartData || { items: [], promotions: [] }),
        [cartData],
    );
    const { total } = cartSubtotalInformation.cost;
    const meetsThreshold = useMemo(() => {
        if (!settingsData) return false;
        return total >= settingsData.freeExpressDeliveryThreshold;
    }, [settingsData, total]);

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
                                `${settingsData!.freeExpressDeliveryThreshold / 100}`,
                            ).toFixed(2)
                        }
                        ! Add another{" "}
                        <b style={{ fontWeight: "bold" }}>
                            £
                            {((settingsData!.freeExpressDeliveryThreshold - total) / 100).toFixed(
                                2,
                            )}
                        </b>{" "}
                        to your order to qualify.
                    </span>
                    <Progress
                        value={(total / settingsData!.freeExpressDeliveryThreshold) * 100}
                        className={styles["delivery-progress-bar"]}
                    />
                </>
            )}
        </div>
    );
}
