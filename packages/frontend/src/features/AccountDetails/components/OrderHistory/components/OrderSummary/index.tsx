import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps, Image } from "@mantine/core";
import { variantOptions } from "@/utils/products/product";
import { PopulatedOrderData } from "@/utils/products/orders";
import dayjs from "dayjs";
import styles from "./index.module.css";

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export type TOrderSummary = {
    data: PopulatedOrderData;
};

export function OrderSummary({ data }: TOrderSummary) {
    const { orders } = useContext(UserContext);
    const { awaiting } = orders;

    const { orderNo, product, variant, quantity, cost, orderDate } = data;
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
                <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                    <Image
                        className={styles["product-thumbnail-image"]}
                        src={src}
                        alt={alt}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    />
                </Skeleton>

                <div className={styles["content-column-2"]}>
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
                            const variantOption = variantOptions.find((vOpt) => vOpt.id === key);
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

                    <div className={styles["quantity"]}>
                        <strong>Count: </strong>
                        <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                            <p style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                {quantity}
                            </p>
                        </Skeleton>
                    </div>
                </div>
            </div>
        </li>
    );
}
