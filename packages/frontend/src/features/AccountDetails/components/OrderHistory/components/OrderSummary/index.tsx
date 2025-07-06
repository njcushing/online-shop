import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps, Image } from "@mantine/core";
import { variantOptions } from "@/utils/products/product";
import { OrderStatus, PopulatedOrderData } from "@/utils/products/orders";
import dayjs from "dayjs";
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

    const { orderNo, status, product, variant, quantity, cost, orderDate, deliveryInfo } = data;
    const { unit, paid } = cost;

    const { name, images } = product;
    const { options, image } = variant;

    const usedImage = image || images.thumb;
    const { src, alt } = usedImage;

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
                        >{`£${(paid / 100).toFixed(2)}`}</p>
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

                <div className={styles["product-information"]}>
                    <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                        <Image
                            className={styles["product-thumbnail-image"]}
                            src={src}
                            alt={alt}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        />
                    </Skeleton>

                    <div className={styles["product-information-column-2"]}>
                        <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                            <p
                                className={styles["product-full-name"]}
                                style={{ visibility: awaiting ? "hidden" : "initial" }}
                            >
                                {name.full}
                            </p>
                        </Skeleton>

                        <div className={styles["product-variant-options"]}>
                            {Object.entries(options).map((option) => {
                                const [key, value] = option;
                                const variantOption = variantOptions.find(
                                    (vOpt) => vOpt.id === key,
                                );
                                const variantOptionValue = variantOption?.values.find(
                                    (vOptVal) => vOptVal.id === value,
                                );
                                return (
                                    <Skeleton
                                        visible={awaiting}
                                        classNames={SkeletonClassNames}
                                        key={`${key}-skeleton`}
                                    >
                                        <div
                                            className={styles["product-variant-option-info"]}
                                            key={key}
                                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                                        >
                                            <p className={styles["product-variant-option-name"]}>
                                                {variantOption?.name || key}:{" "}
                                            </p>
                                            <p className={styles["product-variant-option-value"]}>
                                                {variantOptionValue?.name || value}
                                            </p>
                                        </div>
                                    </Skeleton>
                                );
                            })}
                        </div>

                        <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                            <div
                                className={styles["product-variant-unit-cost"]}
                                style={{ visibility: awaiting ? "hidden" : "initial" }}
                            >
                                <p>{`£${(unit / 100).toFixed(2)}`}</p>
                            </div>
                        </Skeleton>

                        <Skeleton
                            visible={awaiting}
                            width="min-content"
                            height="min-content"
                            classNames={SkeletonClassNames}
                        >
                            <div
                                className={styles["quantity"]}
                                style={{ visibility: awaiting ? "hidden" : "initial" }}
                            >
                                <strong>Count: </strong>
                                <p>{quantity}</p>
                            </div>
                        </Skeleton>
                    </div>
                </div>
            </div>
        </li>
    );
}
