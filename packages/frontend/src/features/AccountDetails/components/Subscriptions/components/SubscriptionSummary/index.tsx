import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Skeleton, Image } from "@mantine/core";
import { variantOptions } from "@/utils/products/product";
import { SubscriptionFrequency, PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import dayjs from "dayjs";
import { Price } from "@/features/Price";
import styles from "./index.module.css";

const subscriptionFrequencyMessage = (frequency: SubscriptionFrequency): string | null => {
    switch (frequency) {
        case "one_week":
            return "week";
        case "two_weeks":
            return "two weeks";
        case "one_month":
            return "month";
        case "three_months":
            return "three months";
        case "six_months":
            return "six months";
        case "one_year":
            return "year";
        default:
            return null;
    }
};

export type TSubscriptionSummary = {
    data: PopulatedSubscriptionData;
};

export function SubscriptionSummary({ data }: TSubscriptionSummary) {
    const { subscriptions } = useContext(UserContext);
    const { awaiting } = subscriptions;

    const { count, frequency, nextDate, product, variant } = data;

    const { id: productId, slug, name, images } = product;
    const { price, options, image } = variant;
    const { current } = price;

    const usedImage = image || images.thumb;
    const { src, alt } = usedImage;

    const variantUrlParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => variantUrlParams.append(key, `${value}`));

    return (
        <li className={styles["subscription-summary"]}>
            <div className={styles["subscription-product"]}>
                <Skeleton visible={awaiting}>
                    <Image
                        className={styles["product-thumbnail-image"]}
                        src={src}
                        alt={alt}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    />
                </Skeleton>

                <div className={styles["product-information"]}>
                    <Skeleton visible={awaiting}>
                        <Link
                            to={`/p/${productId}/${slug}?${variantUrlParams}`}
                            className={styles["product-full-name"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            {name.full}
                        </Link>
                    </Skeleton>

                    <div className={styles["product-variant-options"]}>
                        {Object.entries(options).map((option) => {
                            const [key, value] = option;
                            const variantOption = variantOptions.find((vOpt) => vOpt.id === key);
                            const variantOptionValue = variantOption?.values.find(
                                (vOptVal) => vOptVal.id === value,
                            );
                            return (
                                <Skeleton visible={awaiting} key={`${key}-skeleton`}>
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

                    <Skeleton visible={awaiting}>
                        <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            <Price
                                base={current}
                                current={current}
                                classNames={{ current: styles["price-container"] }}
                            />
                        </div>
                    </Skeleton>
                </div>
            </div>

            <div className={styles["details"]}>
                <Skeleton visible={awaiting}>
                    <div
                        className={styles["frequency"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >{`${count} unit${count !== 1 ? "s" : ""} every ${subscriptionFrequencyMessage(frequency)}`}</div>
                </Skeleton>

                <Skeleton visible={awaiting}>
                    <p
                        className={styles["next-delivery-date"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        Next delivery: {`${dayjs(nextDate).format("MMMM D, YYYY")}`}
                    </p>
                </Skeleton>
            </div>
        </li>
    );
}
