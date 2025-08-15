import { Accordion } from "@mantine/core";
import { PopulatedOrderData } from "@/utils/products/orders";
import styles from "./index.module.css";

export type TOrderDetails = {
    data: PopulatedOrderData;
    awaiting: boolean;
};

export function OrderDetails({ data, awaiting }: TOrderDetails) {
    const { cost, deliveryAddress, billingAddress } = data;

    const { total, products: productsSubtotal, postage } = cost;

    return (
        <Accordion
            classNames={{
                item: styles["accordion-item"],
                control: styles["accordion-control"],
                content: styles["accordion-content"],
            }}
        >
            <Accordion.Item value="Order Details">
                <Accordion.Control
                    classNames={{ label: styles["accordion-label"] }}
                    disabled={awaiting}
                >
                    Order Details
                </Accordion.Control>

                <Accordion.Panel
                    className={styles["accordion-panel"]}
                    style={{ opacity: 1 }} // Override default opacity transition
                >
                    <div className={styles["addresses"]}>
                        <div className={styles["address"]}>
                            <p className={styles["details-title"]}>Delivery Address</p>
                            <div className={styles["address-line"]}>
                                <p>{deliveryAddress.line1}</p>
                            </div>
                            {deliveryAddress.line2 && deliveryAddress.line2.length > 0 && (
                                <div className={styles["address-line"]}>
                                    <p>{deliveryAddress.line2}</p>
                                </div>
                            )}
                            <div className={styles["address-line"]}>
                                <p>{deliveryAddress.townCity}</p>
                            </div>
                            <div className={styles["address-line"]}>
                                <p>{deliveryAddress.county}</p>
                            </div>
                            <div className={styles["address-line"]}>
                                <p>{deliveryAddress.postcode}</p>
                            </div>
                        </div>

                        <div className={styles["address"]}>
                            <p className={styles["details-title"]}>Billing Address</p>
                            <div className={styles["address-line"]}>
                                <p>{billingAddress.line1}</p>
                            </div>
                            {billingAddress.line2 && billingAddress.line2.length > 0 && (
                                <div className={styles["address-line"]}>
                                    <p>{billingAddress.line2}</p>
                                </div>
                            )}
                            <div className={styles["address-line"]}>
                                <p>{billingAddress.townCity}</p>
                            </div>
                            <div className={styles["address-line"]}>
                                <p>{billingAddress.county}</p>
                            </div>
                            <div className={styles["address-line"]}>
                                <p>{billingAddress.postcode}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles["cost-breakdown"]}>
                        <p className={styles["details-title"]}>Cost Breakdown</p>
                        <p className={styles["cost-breakdown-line"]}>
                            Item(s) Subtotal: {`£${(productsSubtotal / 100).toFixed(2)}`}
                        </p>
                        <p className={styles["cost-breakdown-line"]}>
                            Postage: {postage > 0 ? `£${(postage / 100).toFixed(2)}` : "FREE"}
                        </p>
                        <p className={styles["total-cost"]}>
                            Total: {`£${(total / 100).toFixed(2)}`}
                        </p>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
