import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps } from "@mantine/core";
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

    const { orderNo, status, total, products, orderDate, deliveryInfo } = data;

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

                <ul className={styles["product-information"]}>
                    {products.map((product) => {
                        return <OrderProduct data={product} key={uuid()} />;
                    })}
                </ul>
            </div>
        </li>
    );
}
