import { useContext, useState, useEffect, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { Collapse, Skeleton, Radio } from "@mantine/core";
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

    const [lastValidDiscount, setLastValidDiscount] = useState<number>(0);
    useEffect(() => {
        if (!canSubscribe) return;
        setLastValidDiscount(subscriptionDiscountPercentage);
    }, [canSubscribe, subscriptionDiscountPercentage]);

    const labelText = useMemo(() => {
        if (subscriptionDiscountPercentage === 0) {
            return <>Schedule repeat deliveries for this product.</>;
        }
        return (
            <>
                Save <strong>{lastValidDiscount}%</strong> when you schedule repeat deliveries for
                this product.
            </>
        );
    }, [subscriptionDiscountPercentage, lastValidDiscount]);

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
                        <Radio.Indicator
                            disabled={awaitingCart || awaitingProduct}
                            className={styles["radio-indicator"]}
                        />
                        <span className={styles["radio-label"]}>{labelText}</span>
                    </Radio.Card>
                </div>
            </Skeleton>
        </Collapse>
    );
}
