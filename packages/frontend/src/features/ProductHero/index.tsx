import { useContext, useState, useEffect, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Skeleton, Button, Divider, Rating } from "@mantine/core";
import {
    findCollections,
    filterVariantOptions,
    Product,
    ProductVariant,
} from "@/utils/products/product";
import { Quantity } from "@/components/Inputs/Quantity";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { Price } from "@/features/Price";
import { calculateMaxAddableVariantStock } from "@/utils/products/utils/calculateMaxAddableVariantStock";
import { SubscriptionFrequency } from "@/utils/products/subscriptions";
import { ImageCarousel } from "./components/ImageCarousel";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
import { SubscriptionToggle } from "./components/SubscriptionToggle";
import { VariantAlerts } from "./components/VariantAlerts";
import { WatchlistButton } from "./components/WatchlistButton";
import styles from "./index.module.css";

export function ProductHero() {
    const { cart } = useContext(UserContext);
    const { product, variant, defaultData } = useContext(ProductContext);
    const {
        product: defaultProductData,
        variant: defaultVariantData,
        variantOptions: defaultVariantOptionsData,
        collectionSteps: defaultCollectionStepsData,
    } = defaultData;

    const { response: cartResponse, awaiting: cartAwaiting } = cart;
    const { response: productResponse, awaiting: productAwaiting } = product;

    const { success: cartSuccess } = cartResponse;
    const { success: productSuccess } = productResponse;

    const awaitingAny = cartAwaiting || productAwaiting;

    let cartData = null;
    let productData = defaultProductData as Product;
    let variantData = defaultVariantData as ProductVariant;

    if (!awaitingAny) {
        if (!cartSuccess) throw new Error("Cart not found");
        if (!productSuccess) throw new Error("Product not found");
        if (!variant) throw new Error("Product variant not found");

        cartData = cartResponse.data;
        productData = productResponse.data;
        variantData = variant;
    }

    const variantOptions = useMemo<ReturnType<typeof filterVariantOptions>>(() => {
        if (awaitingAny) return defaultVariantOptionsData;
        if (!productData || !variantData) return new Map();
        return filterVariantOptions(productData, variantData.options);
    }, [awaitingAny, productData, variantData, defaultVariantOptionsData]);

    const collectionsData = useMemo<ReturnType<typeof findCollections>>(() => {
        if (awaitingAny) return defaultCollectionStepsData;
        return findCollections(productData?.id || "");
    }, [awaitingAny, productData, defaultCollectionStepsData]);

    const [subscriptionChecked, setSubscriptionChecked] = useState<boolean>(false);
    const [frequency, setFrequency] = useState<SubscriptionFrequency>("one_week");
    useEffect(() => {
        setSubscriptionChecked(false);
    }, [product, variantData]);
    useEffect(() => {
        if (subscriptionChecked) setFrequency("one_week");
    }, [subscriptionChecked]);

    const [, /* quantity */ setQuantity] = useState<number | null>(1);

    const maximumVariantQuantity = useMemo(() => {
        if (awaitingAny || !cartData?.items || !productData || !variantData) {
            return 0;
        }
        return calculateMaxAddableVariantStock(cartData.items, productData, variantData);
    }, [awaitingAny, cartData, productData, variantData]);

    const { name, images, rating, variantOptionOrder } = productData;
    const { price, options } = variantData;
    const { subscriptionDiscountPercentage } = price;

    let unitPrice = price.current;
    if (subscriptionChecked) unitPrice *= 1 - subscriptionDiscountPercentage / 100;

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <div>
                    <ImageCarousel images={images.dynamic} awaiting={awaitingAny} />
                </div>

                <div className={styles["product-content"]}>
                    <Skeleton visible={awaitingAny} className={styles["margin"]}>
                        <h1
                            className={styles["product-name"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            {name!.full}
                        </h1>
                    </Skeleton>

                    <Skeleton visible={awaitingAny} className={styles["margin"]}>
                        <div
                            className={styles["product-hero-rating-container"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            <Rating
                                className={styles["product-rating"]}
                                readOnly
                                count={5}
                                fractions={10}
                                value={rating.meanValue}
                                color="gold"
                                size="sm"
                            />
                            <div className={styles["product-rating-value"]}>
                                {rating.meanValue.toFixed(2)}
                            </div>
                            <div
                                className={styles["product-rating-quantity"]}
                            >{`(${rating.totalQuantity})`}</div>
                        </div>
                    </Skeleton>

                    <Divider className={styles["margin"]} />

                    <div
                        className={`${styles["product-hero-steps-container"]} ${styles["margin"]}`}
                    >
                        {collectionsData.map((collectionData, i) => {
                            const step = <CollectionStep collectionData={collectionData} />;
                            return (
                                <Skeleton visible={awaitingAny} key={collectionData.collection.id}>
                                    <div
                                        style={{
                                            visibility: awaitingAny ? "hidden" : "initial",
                                        }}
                                    >
                                        {step}
                                        {i < collectionsData.length - 1 && <Divider />}
                                    </div>
                                </Skeleton>
                            );
                        })}

                        {collectionsData.length > 0 && <Divider />}

                        {variantOptions &&
                            variantOptionOrder.map((optionId, i) => {
                                const optionValues = variantOptions.get(optionId);
                                if (!optionValues || optionValues.size === 0) return null;
                                const step = (
                                    <VariantStep
                                        id={optionId}
                                        values={optionValues}
                                        selected={options[optionId]}
                                    />
                                );
                                return (
                                    <Skeleton visible={awaitingAny} key={optionId}>
                                        <div
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        >
                                            {step}
                                            {i < variantOptions.size - 1 && <Divider />}
                                        </div>
                                    </Skeleton>
                                );
                            })}

                        {variantOptionOrder.length > 0 && <Divider />}
                    </div>

                    <Skeleton visible={awaitingAny} className={styles["margin"]}>
                        <div style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                            <Price base={price.base} current={unitPrice} size="lg" />
                        </div>
                    </Skeleton>

                    <SubscriptionToggle
                        checked={subscriptionChecked}
                        selectedFrequency={frequency}
                        onToggle={() => setSubscriptionChecked((c) => !c)}
                        onFrequencyChange={(f) => setFrequency(f)}
                    />

                    <VariantAlerts />

                    <div
                        className={`${styles["product-hero-buttons-container"]} ${styles["margin"]}`}
                    >
                        <Quantity
                            defaultValue={1}
                            min={1}
                            max={Math.max(1, maximumVariantQuantity)}
                            disabled={awaitingAny || maximumVariantQuantity === 0}
                            onQuantityChange={(v) => setQuantity(v)}
                        />

                        <Button
                            color="#242424"
                            className={styles["add-to-cart-button"]}
                            disabled={awaitingAny || maximumVariantQuantity === 0}
                        >
                            Add to Cart
                        </Button>

                        <WatchlistButton />
                    </div>

                    <Skeleton visible={awaitingAny}>
                        <div style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                            <DeliveryProgress />
                        </div>
                    </Skeleton>
                </div>
            </div>
        </section>
    );
}
