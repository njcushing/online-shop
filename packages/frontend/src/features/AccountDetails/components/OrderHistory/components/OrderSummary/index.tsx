import { Fragment, useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Divider, Skeleton, SkeletonProps, Accordion } from "@mantine/core";
import { OrderStatus, PopulatedOrderData } from "@/utils/products/orders";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { OrderProduct } from "../OrderProduct";
import styles from "./index.module.css";

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

const statusMessage = (
    awaiting: boolean,
    status: OrderStatus,
    deliveryInfo: PopulatedOrderData["deliveryInfo"],
) => {
    const { expectedDate, deliveredDate } = deliveryInfo;

    const expectedDateElement = (
        <Skeleton visible={awaiting} width="min-content" classNames={SkeletonClassNames}>
            <span
                className={styles["expected-date"]}
                style={{ visibility: awaiting ? "hidden" : "initial" }}
            >
                {expectedDate &&
                    `Expected delivery date: ${dayjs(deliveredDate).format("MMMM D, YYYY")}`}
            </span>
        </Skeleton>
    );

    let statusMessageText = "";
    let includeExpectedDate = false;

    switch (status) {
        case "pending":
            statusMessageText = "Order pending";
            includeExpectedDate = true;
            break;
        case "paid":
            statusMessageText = "Awaiting dispatch";
            includeExpectedDate = true;
            break;
        case "shipped":
            statusMessageText = "Order dispatched";
            includeExpectedDate = true;
            break;
        case "delivered":
            statusMessageText = `Delivered${deliveredDate && ` ${dayjs(deliveredDate).format("MMMM D, YYYY")}`}`;
            break;
        case "cancelled":
            statusMessageText = "Order cancelled";
            break;
        case "refunded":
            statusMessageText = "Order refunded";
            break;
        default:
    }

    return (
        <>
            <Skeleton visible={awaiting} width="min-content" classNames={SkeletonClassNames}>
                <p
                    className={styles["status-message"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {statusMessageText}
                </p>
            </Skeleton>
            {includeExpectedDate && expectedDateElement}
        </>
    );
};

export type TOrderSummary = {
    data: PopulatedOrderData;
};

export function OrderSummary({ data }: TOrderSummary) {
    const { orders } = useContext(UserContext);
    const { awaiting } = orders;

    const {
        orderNo,
        status,
        cost,
        products,
        orderDate,
        deliveryAddress,
        billingAddress,
        deliveryInfo,
    } = data;

    const { total, products: productsSubtotal, postage } = cost;

    return (
        <li className={styles["order-summary"]}>
            <div className={styles["top-bar"]}>
                <div className={styles["order-no"]}>
                    <strong>Order Number</strong>
                    <Skeleton
                        visible={awaiting}
                        width="min-content"
                        classNames={SkeletonClassNames}
                    >
                        <p style={{ visibility: awaiting ? "hidden" : "initial" }}>{orderNo}</p>
                    </Skeleton>
                </div>

                <div className={styles["total"]}>
                    <strong>Total</strong>{" "}
                    <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                        <p
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`£${(total / 100).toFixed(2)}`}</p>
                    </Skeleton>
                </div>

                <div className={styles["order-date"]}>
                    <strong>Order Date</strong>{" "}
                    <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                        <p
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`${dayjs(orderDate).format("MMMM D, YYYY")}`}</p>
                    </Skeleton>
                </div>
            </div>

            <div className={styles["content"]}>
                <div className={styles["status"]}>
                    {statusMessage(awaiting, status, deliveryInfo)}
                </div>

                <ul className={styles["products"]}>
                    {products.map((product, i) => {
                        return (
                            <Fragment key={uuid()}>
                                <OrderProduct data={product} />
                                {i < products.length - 1 && (
                                    <Divider size="sm" color="rgb(250, 223, 198)" />
                                )}
                            </Fragment>
                        );
                    })}
                </ul>
            </div>

            <Accordion
                classNames={{
                    item: styles["accordion-item"],
                    control: styles["accordion-control"],
                    content: styles["accordion-content"],
                }}
            >
                <Accordion.Item value="Order Details">
                    <Accordion.Control classNames={{ label: styles["accordion-label"] }}>
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
        </li>
    );
}
