import { useContext, useState, useEffect } from "react";
import { RootContext } from "@/pages/Root";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetSettingsResponseDto } from "@/api/settings/GET";
import { Truck } from "@phosphor-icons/react";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function Delivery() {
    const { settings } = useContext(RootContext);

    const [settingsData, setSettingsData] = useState<GetSettingsResponseDto | null>(null);

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "settings", context: settings }],
    });

    useEffect(() => {
        if (!awaitingAny && data.settings) setSettingsData(data.settings);
    }, [data.settings, awaitingAny]);

    useEffect(() => {
        document.title = `Delivery | ${siteConfig.title}`;
    }, []);

    if (!settingsData) return null;

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}>
                    <span className={styles["heading-container"]}>
                        <Truck color="rgba(0, 0, 0, 0.2)" size={120} className={styles["symbol"]} />

                        <h1 className={styles["title"]}>Delivery Information</h1>
                    </span>
                    <div className={styles["content-container"]}>
                        <div className={styles["content-inner-container"]}>
                            <h2>
                                Standard Delivery <strong>(FREE)</strong>
                            </h2>

                            <p>
                                Free delivery on all orders of at least{" "}
                                <strong>£{settingsData.freeExpressDeliveryThreshold}.</strong>
                            </p>

                            <p>
                                We aim to ship all orders within 48h of time of purchase; this is
                                guaranteed if the order is placed before 5pm.
                            </p>
                        </div>

                        <div className={styles["content-inner-container"]}>
                            <h2>
                                Express Delivery (£
                                {settingsData.baseExpressDeliveryCost})
                            </h2>

                            <p>Guaranteed next-day delivery on all orders if placed before 5pm.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
