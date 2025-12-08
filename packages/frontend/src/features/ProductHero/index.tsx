import { useContext, useState, useEffect, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { Skeleton, Button, Divider, Rating } from "@mantine/core";
import { ResponseBody as GetProductBySlugDto } from "@/api/products/[slug]/GET";
import { Quantity } from "@/components/Inputs/Quantity";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { Price } from "@/features/Price";
import { calculateMaxAddableVariantStock } from "@/utils/products/utils/calculateMaxAddableVariantStock";
import { Cart } from "@/utils/products/cart";
import { SubscriptionFrequency } from "@/utils/products/subscriptions";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ImageCarousel } from "./components/ImageCarousel";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
import { SubscriptionToggle } from "./components/SubscriptionToggle";
import { VariantAlerts } from "./components/VariantAlerts";
import { WatchlistButton } from "./components/WatchlistButton";
import styles from "./index.module.css";

export function ProductHero() {
    const { cart } = useContext(UserContext);
    const { product, variant, relatedAttributes, defaultData } = useContext(ProductContext);
    const { product: defaultProductData, variant: defaultVariantData } = defaultData;

    const [cartData, setCartData] = useState<Cart | null>(null);
    const [productData, setProductData] = useState<GetProductBySlugDto>(
        defaultProductData as GetProductBySlugDto,
    );
    const [variantData, setVariantData] = useState<GetProductBySlugDto["variants"][number]>(
        defaultVariantData as GetProductBySlugDto["variants"][number],
    );
    const [relatedAttributesData, setRelatedAttributesData] = useState<
        IProductContext["relatedAttributes"]
    >([]);

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "cart", context: cart },
            { name: "product", context: product },
        ],
    });

    useEffect(() => {
        if (!awaitingAny && data.cart) setCartData(data.cart);
    }, [awaitingAny, data.cart]);

    useEffect(() => {
        if (!awaitingAny && data.product) setProductData(data.product);
    }, [awaitingAny, data.product]);

    useEffect(() => {
        if (!awaitingAny && variant) setVariantData(variant);
    }, [awaitingAny, variant]);

    useEffect(() => {
        if (!awaitingAny && data.product && variant) setRelatedAttributesData(relatedAttributes);
    }, [awaitingAny, data.product, variant, relatedAttributes]);

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

    const { name, images, rating, collections } = productData;
    const { priceBase, priceCurrent, subscriptionDiscountPercentage } = variantData;

    let unitPrice = priceCurrent;
    if (subscriptionChecked) unitPrice *= 1 - subscriptionDiscountPercentage! / 100;

    const imageCarouselMemo = useMemo(() => {
        return <ImageCarousel images={images} awaiting={awaitingAny} />;
    }, [awaitingAny, images]);

    const ratingMemo = useMemo(() => {
        return (
            <>
                <Rating
                    className={styles["product-rating"]}
                    readOnly
                    count={5}
                    fractions={10}
                    value={rating.average}
                    color="gold"
                    size="sm"
                />
                <div className={styles["product-rating-value"]}>{rating.average.toFixed(2)}</div>
                <div className={styles["product-rating-quantity"]}>{`(${rating.total})`}</div>
            </>
        );
    }, [rating.average, rating.total]);

    const collectionQuantitiesMemo = useMemo(() => {
        return collections.map((collection, i) => {
            return (
                <Skeleton visible={awaitingAny} key={collection.id}>
                    <div
                        style={{
                            visibility: awaitingAny ? "hidden" : "initial",
                        }}
                    >
                        <CollectionStep collectionData={collection} />
                        {i < collections.length - 1 && <Divider />}
                    </div>
                </Skeleton>
            );
        });
    }, [awaitingAny, collections]);

    const relatedAttributesMemo = useMemo(() => {
        return relatedAttributesData.map((attribute, i) => {
            const { info, values } = attribute;
            if (values.length === 0) return null;
            return (
                <Skeleton visible={awaitingAny} key={info.name}>
                    <div
                        style={{
                            visibility: awaitingAny ? "hidden" : "initial",
                        }}
                    >
                        <VariantStep attribute={attribute} />
                        {i < relatedAttributesData.length - 1 && <Divider />}
                    </div>
                </Skeleton>
            );
        });
    }, [relatedAttributesData, awaitingAny]);

    const priceMemo = useMemo(() => {
        return <Price base={priceBase} current={unitPrice} size="lg" />;
    }, [priceBase, unitPrice]);

    const subscriptionToggleMemo = useMemo(() => {
        return (
            <SubscriptionToggle
                checked={subscriptionChecked}
                selectedFrequency={frequency}
                onToggle={() => setSubscriptionChecked((c) => !c)}
                onFrequencyChange={(f) => setFrequency(f)}
            />
        );
    }, [subscriptionChecked, frequency]);

    const variantAlertsMemo = useMemo(() => <VariantAlerts />, []);

    const quantityMemo = useMemo(() => {
        return (
            <Quantity
                defaultValue={1}
                min={1}
                max={Math.max(1, maximumVariantQuantity)}
                disabled={awaitingAny || maximumVariantQuantity === 0}
                onQuantityChange={(v) => setQuantity(v)}
            />
        );
    }, [awaitingAny, maximumVariantQuantity]);

    const watchListButtonMemo = useMemo(() => <WatchlistButton />, []);

    const deliveryProgressMemo = useMemo(() => <DeliveryProgress />, []);

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <div>{imageCarouselMemo}</div>

                <div className={styles["product-content"]}>
                    <Skeleton visible={awaitingAny} className={styles["margin"]}>
                        <h1
                            className={styles["product-name"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            {name}
                        </h1>
                    </Skeleton>

                    <Skeleton visible={awaitingAny} className={styles["margin"]}>
                        <div
                            className={styles["product-hero-rating-container"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            {ratingMemo}
                        </div>
                    </Skeleton>

                    <Divider className={styles["margin"]} />

                    <div
                        className={`${styles["product-hero-steps-container"]} ${styles["margin"]}`}
                    >
                        {collectionQuantitiesMemo}

                        {collectionQuantitiesMemo.length > 0 && <Divider />}

                        {relatedAttributesMemo}

                        {relatedAttributesMemo.length > 0 && <Divider />}
                    </div>

                    <Skeleton visible={awaitingAny} className={styles["margin"]}>
                        <div style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                            {priceMemo}
                        </div>
                    </Skeleton>

                    {subscriptionToggleMemo}

                    {variantAlertsMemo}

                    <div
                        className={`${styles["product-hero-buttons-container"]} ${styles["margin"]}`}
                    >
                        {quantityMemo}

                        <Button
                            color="#242424"
                            className={styles["add-to-cart-button"]}
                            disabled={awaitingAny || maximumVariantQuantity === 0}
                        >
                            Add to Cart
                        </Button>

                        {watchListButtonMemo}
                    </div>

                    <Skeleton visible={awaitingAny}>
                        <div style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                            {deliveryProgressMemo}
                        </div>
                    </Skeleton>
                </div>
            </div>
        </section>
    );
}
