import { useContext } from "react";
import { RootContext } from "@/pages/Root";
import { Accordion, Skeleton } from "@mantine/core";
import { PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import styles from "./index.module.css";

export type TSubscriptionDetails = {
    data: PopulatedSubscriptionData;
    awaiting: boolean;
};

export function SubscriptionDetails({ data, awaiting }: TSubscriptionDetails) {
    const { settings } = useContext(RootContext);
    const { response: settingsResponse, awaiting: settingsAwaiting } = settings;
    const { success: settingsSuccess } = settingsResponse;

    const awaitingAny = awaiting || settingsAwaiting;

    let settingsData = { baseExpressDeliveryCost: 0, freeExpressDeliveryThreshold: 0 };

    if (!awaitingAny) {
        if (!settingsSuccess) throw new Error(settingsResponse.message);

        settingsData = settingsResponse.data;
    }

    const { deliveryAddress, billingAddress, count, variant } = data;
    const { price } = variant;
    const { current, subscriptionDiscountPercentage } = price;

    const { baseExpressDeliveryCost, freeExpressDeliveryThreshold } = settingsData;
    const estimatedUnitCost = current * (1 - subscriptionDiscountPercentage / 100) * count;
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
