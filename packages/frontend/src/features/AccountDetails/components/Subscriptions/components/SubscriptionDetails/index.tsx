import { useContext } from "react";
import { RootContext } from "@/pages/Root";
import { Accordion, Skeleton } from "@mantine/core";
import { SubscriptionData } from "@/utils/products/subscriptions";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import styles from "./index.module.css";

export type TSubscriptionDetails = {
    data: SubscriptionData;
    awaiting: boolean;
};

export function SubscriptionDetails({ data, awaiting }: TSubscriptionDetails) {
    const { settings } = useContext(RootContext);

    let settingsData = { baseExpressDeliveryCost: 0, freeExpressDeliveryThreshold: 0 };

    const { data: contextData, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "settings", context: settings }] as const,
    });

    const awaitingAny = contextAwaitingAny || awaiting;

    if (!awaitingAny) {
        if (contextData.settings) settingsData = contextData.settings;
    }

    const { deliveryAddress, billingAddress, count, variant } = data;
    const { priceCurrent, subscriptionDiscountPercentage } = variant;

    const { baseExpressDeliveryCost, freeExpressDeliveryThreshold } = settingsData;
    let estimatedUnitCost = priceCurrent * count;
    if (
        typeof subscriptionDiscountPercentage !== "undefined" &&
        subscriptionDiscountPercentage !== null
    ) {
        estimatedUnitCost *= 1 - subscriptionDiscountPercentage / 100;
    }
    const meetsFreeDeliveryThreshold = estimatedUnitCost >= freeExpressDeliveryThreshold;
    const deliveryCost = meetsFreeDeliveryThreshold ? 0 : baseExpressDeliveryCost;
    const subtotal = estimatedUnitCost + deliveryCost;

    return (
        <Accordion
            classNames={{
                item: styles["accordion-item"],
                control: styles["accordion-control"],
                content: styles["accordion-content"],
            }}
        >
            <Accordion.Item value="Subscription Details">
                <Accordion.Control
                    classNames={{ label: styles["accordion-label"] }}
                    disabled={awaitingAny}
                >
                    Subscription Details
                </Accordion.Control>

                <Accordion.Panel
                    className={styles["accordion-panel"]}
                    style={{ opacity: 1 }} // Override default opacity transition
                >
                    <div className={styles["addresses"]}>
                        <div className={styles["address"]}>
                            <Skeleton visible={awaitingAny}>
                                <p
                                    className={styles["details-title"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    Delivery Address
                                </p>
                            </Skeleton>
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{deliveryAddress.line1}</p>
                                </div>
                            </Skeleton>
                            {deliveryAddress.line2 && deliveryAddress.line2.length > 0 && (
                                <Skeleton visible={awaitingAny}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                    >
                                        <p>{deliveryAddress.line2}</p>
                                    </div>
                                </Skeleton>
                            )}
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{deliveryAddress.townCity}</p>
                                </div>
                            </Skeleton>
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{deliveryAddress.county}</p>
                                </div>
                            </Skeleton>
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{deliveryAddress.postcode}</p>
                                </div>
                            </Skeleton>
                        </div>

                        <div className={styles["address"]}>
                            <Skeleton visible={awaitingAny}>
                                <p
                                    className={styles["details-title"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    Billing Address
                                </p>
                            </Skeleton>
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{billingAddress.line1}</p>
                                </div>
                            </Skeleton>
                            {billingAddress.line2 && billingAddress.line2.length > 0 && (
                                <Skeleton visible={awaitingAny}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                    >
                                        <p>{billingAddress.line2}</p>
                                    </div>
                                </Skeleton>
                            )}
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{billingAddress.townCity}</p>
                                </div>
                            </Skeleton>
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{billingAddress.county}</p>
                                </div>
                            </Skeleton>
                            <Skeleton visible={awaitingAny}>
                                <div
                                    className={styles["address-line"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    <p>{billingAddress.postcode}</p>
                                </div>
                            </Skeleton>
                        </div>
                    </div>

                    <div className={styles["cost-breakdown"]}>
                        <Skeleton visible={awaitingAny}>
                            <p
                                className={styles["details-title"]}
                                style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                            >
                                Estimated Cost Breakdown
                            </p>
                        </Skeleton>
                        <Skeleton visible={awaitingAny}>
                            <p
                                className={styles["cost-breakdown-line"]}
                                style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                            >
                                Item(s) Subtotal: {`£${(estimatedUnitCost / 100).toFixed(2)}`}
                            </p>
                        </Skeleton>
                        <Skeleton visible={awaitingAny}>
                            <p
                                className={styles["cost-breakdown-line"]}
                                style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                            >
                                Postage:{" "}
                                {deliveryCost > 0 ? `£${(deliveryCost / 100).toFixed(2)}` : "FREE"}
                            </p>
                        </Skeleton>
                        <Skeleton visible={awaitingAny}>
                            <p
                                className={styles["total-cost"]}
                                style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                            >
                                Total: {`£${(subtotal / 100).toFixed(2)}`}
                            </p>
                        </Skeleton>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
