import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/pages/Root";
import { Collapse, Skeleton, Radio } from "@mantine/core";
import { IProductContext, ProductContext } from "@/pages/Product";
import { frequencies, SubscriptionFrequency } from "@/utils/products/subscriptions";
import styles from "./index.module.css";

export type TSubscriptionProduct = {
    checked: boolean;
    onToggle: () => void;
};

export function SubscriptionToggle({ checked, onToggle }: TSubscriptionProduct) {
    const { cart } = useContext(UserContext);
    const { product, variant, defaultData } = useContext(ProductContext);
    const { variant: defaultVariantData } = defaultData;

    const { awaiting: awaitingCart } = cart;
    const { awaiting: awaitingProduct } = product;

    const { canSubscribe, price } = !awaitingProduct
        ? variant!
        : (defaultVariantData as NonNullable<IProductContext["variant"]>);
    const { subscriptionDiscountPercentage } = price;

    const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequency>("one_week");

    const [lastValidDiscount, setLastValidDiscount] = useState<number>(0);
    useEffect(() => {
        if (!canSubscribe) return;
        setLastValidDiscount(subscriptionDiscountPercentage);
    }, [canSubscribe, subscriptionDiscountPercentage]);

    const [labelText, setLabelText] = useState<React.ReactNode>(null);
    useEffect(() => {
        if (!canSubscribe) return;
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
            in={!awaitingProduct && canSubscribe}
            animateOpacity={false}
            transitionDuration={500}
        >
            <Skeleton visible={awaitingProduct}>
                <div style={{ visibility: awaitingProduct ? "hidden" : "initial" }}>
                    <Radio.Card
                        checked={checked}
                        onClick={() => onToggle()}
                        className={styles["radio-card"]}
                    >
                        <div className={styles["radio-card-top"]}>
                            <Radio.Indicator
                                disabled={awaitingCart || awaitingProduct}
                                className={styles["radio-indicator"]}
                            />
                            <span className={styles["radio-label"]}>{labelText}</span>
                        </div>
                        <Collapse in={checked} animateOpacity={false} transitionDuration={250}>
                            <div className={styles["radio-card-middle"]}>
                                <label
                                    htmlFor="update-delivery-frequency"
                                    className={styles["update-delivery-frequency-label"]}
                                >
                                    <p>Select a delivery frequency</p>
                                    <select
                                        className={styles["select"]}
                                        id="update-delivery-frequency"
                                        name="frequency"
                                        value={selectedFrequency}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setSelectedFrequency(value as SubscriptionFrequency);
                                        }}
                                        disabled={awaitingCart || awaitingProduct}
                                    >
                                        {Object.entries(frequencies).map((entry) => {
                                            const [key, value] = entry;
                                            const { optionName } = value;

                                            return (
                                                <option
                                                    className={styles["frequency-option"]}
                                                    value={key}
                                                    onClick={(e) => e.stopPropagation()}
                                                    key={`frequency-option-${key}`}
                                                >
                                                    {optionName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </label>
                            </div>
                        </Collapse>
                    </Radio.Card>
                </div>
            </Skeleton>
        </Collapse>
    );
}
