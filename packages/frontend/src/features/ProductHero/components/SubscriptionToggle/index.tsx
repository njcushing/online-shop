import { useContext, useState, useEffect } from "react";
import { Collapse, Skeleton, Radio } from "@mantine/core";
import { UserContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/product/[slug]/GET";
import { frequencies, SubscriptionFrequency } from "@/utils/products/subscriptions";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import styles from "./index.module.css";

export type TSubscriptionToggle = {
    checked: boolean;
    selectedFrequency: SubscriptionFrequency;
    onToggle: () => void;
    onFrequencyChange: (frequency: SubscriptionFrequency) => void;
};

export function SubscriptionToggle({
    checked,
    selectedFrequency,
    onToggle,
    onFrequencyChange,
}: TSubscriptionToggle) {
    const { cart } = useContext(UserContext);
    const { product, variant, defaultData } = useContext(ProductContext);

    let variantData = defaultData.variant as GetProductBySlugResponseDto["variants"][number];

    const { awaitingAny } = useQueryContexts({
        contexts: [
            { name: "cart", context: cart },
            { name: "product", context: product },
        ],
    });

    if (!awaitingAny) {
        if (variant) variantData = variant;
    }

    const { canSubscribe, subscriptionDiscountPercentage } = variantData;

    const [lastValidDiscount, setLastValidDiscount] = useState<number>(0);
    useEffect(() => {
        if (!canSubscribe || !subscriptionDiscountPercentage) return;
        setLastValidDiscount(subscriptionDiscountPercentage);
    }, [canSubscribe, subscriptionDiscountPercentage]);

    const [labelText, setLabelText] = useState<React.ReactNode>(null);
    useEffect(() => {
        if (!canSubscribe || typeof subscriptionDiscountPercentage === "undefined") return;
        if (subscriptionDiscountPercentage === 0) {
            setLabelText(<>Schedule repeat deliveries for this product.</>);
            return;
        }
        setLabelText(
            <>
                Save <strong>{lastValidDiscount}%</strong> when you schedule repeat deliveries for
                this product.
            </>,
        );
    }, [canSubscribe, subscriptionDiscountPercentage, lastValidDiscount]);

    return (
        <Collapse
            in={!awaitingAny && !!canSubscribe}
            animateOpacity={false}
            transitionDuration={500}
        >
            <Skeleton visible={awaitingAny}>
                <div
                    className={styles["subscription-toggle"]}
                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                >
                    <Radio.Card
                        checked={checked}
                        onClick={() => onToggle()}
                        className={styles["radio-card"]}
                    >
                        <div className={styles["radio-card-top"]}>
                            <Radio.Indicator
                                disabled={awaitingAny}
                                className={styles["radio-indicator"]}
                            />

                            <span className={styles["radio-label"]}>{labelText}</span>
                        </div>
                    </Radio.Card>

                    <Collapse in={checked} animateOpacity={false} transitionDuration={250}>
                        <div className={styles["radio-card-middle"]}>
                            <label
                                htmlFor="update-delivery-frequency"
                                className={styles["update-delivery-frequency-label"]}
                            >
                                Select a delivery frequency
                                <select
                                    className={styles["select"]}
                                    id="update-delivery-frequency"
                                    name="frequency"
                                    value={selectedFrequency}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        onFrequencyChange(value as SubscriptionFrequency);
                                    }}
                                    disabled={awaitingAny}
                                >
                                    {Object.entries(frequencies).map((entry) => {
                                        const [key, value] = entry;
                                        const { optionName } = value;

                                        return (
                                            <option
                                                className={styles["frequency-option"]}
                                                value={key}
                                                key={`frequency-option-${key}`}
                                            >
                                                {optionName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>

                            <ul className={styles["repeat-delivery-info-container"]}>
                                {canSubscribe &&
                                    typeof subscriptionDiscountPercentage !== "undefined" &&
                                    subscriptionDiscountPercentage !== null &&
                                    subscriptionDiscountPercentage > 0 && (
                                        <li>
                                            <strong>Discount:</strong> receive a discounted price
                                            when subscribing to this product. The discount is
                                            calculated on the current price of the product, after
                                            any other price reductions have been applied
                                        </li>
                                    )}
                                <li>
                                    <strong>No fees:</strong> we will continue shipping this product
                                    to you at your specified delivery frequency
                                </li>
                                <li>
                                    <strong>Easy cancellation:</strong> cancel your subscription at
                                    any time
                                </li>
                                <li>
                                    <strong>Flexible:</strong> change the frequency of your active
                                    subscriptions in your account details
                                </li>
                                <li>
                                    <strong>Be aware:</strong> ensure you check your active
                                    subscriptions regularly to stay informed about any changes to
                                    the price and subscription discount for those products
                                </li>
                            </ul>
                        </div>
                    </Collapse>
                </div>
            </Skeleton>
        </Collapse>
    );
}
