import { Fragment, useContext } from "react";
import { UserContext } from "@/pages/Root";
import { useMatches, Divider, Skeleton } from "@mantine/core";
import { OrderStatus, PopulatedOrderData } from "@/utils/products/orders";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { OrderProduct } from "../OrderProduct";
import { OrderDetails } from "../OrderDetails";
import styles from "./index.module.css";

const statusMessage = (
    awaiting: boolean,
    status: OrderStatus,
    deliveryInfo: PopulatedOrderData["deliveryInfo"],
) => {
    const { expectedDate, deliveredDate } = deliveryInfo;

    const expectedDateElement = (
        <Skeleton visible={awaiting} width="min-content">
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
            <Skeleton visible={awaiting} width="min-content">
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

    const { orderNo, status, cost, products, orderDate, deliveryInfo } = data;

    const { total } = cost;

    const wide = useMatches({ base: false, md: true });

    return (
        <li className={styles["order-summary"]}>
            <div className={styles["top-bar"]} data-wide={wide}>
                {wide && (
                    <div className={styles["order-no-wide"]}>
                        <Skeleton visible={awaiting} width="min-content">
                            <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                Order Number
                            </strong>
                        </Skeleton>
                        <Skeleton visible={awaiting} width="min-content">
                            <p style={{ visibility: awaiting ? "hidden" : "initial" }}>{orderNo}</p>
                        </Skeleton>
                    </div>
                )}

                <div className={styles["total"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            Total
                        </strong>
                    </Skeleton>
                    <Skeleton visible={awaiting}>
                        <p
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`£${(total / 100).toFixed(2)}`}</p>
                    </Skeleton>
                </div>

                <div className={styles["order-date"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            Order Date
                        </strong>
                    </Skeleton>
                    <Skeleton visible={awaiting}>
                        <p
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`${dayjs(orderDate).format("MMMM D, YYYY")}`}</p>
                    </Skeleton>
                </div>
            </div>

            <div className={styles["content"]}>
                {!wide && (
                    <div className={styles["order-no-thin"]}>
                        <Skeleton visible={awaiting} width="min-content">
                            <strong style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                Order Number:
                            </strong>
                        </Skeleton>
                        <Skeleton visible={awaiting} width="min-content">
                            <p
                                style={{ visibility: awaiting ? "hidden" : "initial" }}
                                className="truncate-ellipsis"
                            >
                                {orderNo}
                            </p>
                        </Skeleton>
                    </div>
                )}

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

            <OrderDetails data={data} />
        </li>
    );
}
