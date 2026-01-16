import { useContext, useState, useEffect, useMemo, Fragment } from "react";
import { UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { useMatches, Skeleton, Button, Divider, Rating } from "@mantine/core";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import { Quantity } from "@/components/Inputs/Quantity";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { Price } from "@/features/Price";
import { calculateMaxAddableVariantStock } from "@/utils/products/utils/calculateMaxAddableVariantStock";
import { Cart } from "@/utils/products/cart";
import { SubscriptionFrequency } from "@/utils/products/subscriptions";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { Plus, ShoppingCartSimple } from "@phosphor-icons/react";
import { ImageCarousel } from "./components/ImageCarousel";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
import { SubscriptionToggle } from "./components/SubscriptionToggle";
import { VariantAlerts } from "./components/VariantAlerts";
import { WatchlistButton } from "./components/WatchlistButton";
import styles from "./index.module.css";

export function ProductHero() {
    const narrow = useMatches({ base: true, xs: false }, { getInitialValueInEffect: false });

    const { cart } = useContext(UserContext);
    const { product, variant, relatedAttributes, defaultData } = useContext(ProductContext);
    const { product: defaultProductData, variant: defaultVariantData } = defaultData;

    const [cartData, setCartData] = useState<Cart | null>(null);
    const [productData, setProductData] = useState<GetProductBySlugResponseDto>(
        defaultProductData as GetProductBySlugResponseDto,
    );
    const [variantData, setVariantData] = useState<GetProductBySlugResponseDto["variants"][number]>(
        defaultVariantData as GetProductBySlugResponseDto["variants"][number],
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

    const [displaySkeletons, setDisplaySkeletons] = useState(true);
    useEffect(() => setDisplaySkeletons(awaitingAny), [awaitingAny]);

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

    const collectionStepsMemo = useMemo(() => {
        return collections.map((collection, i) => {
            return (
                <Fragment key={collection.id}>
                    <Skeleton visible={displaySkeletons}>
                        <div
                            style={{
                                visibility: displaySkeletons ? "hidden" : "initial",
                            }}
                        >
                            <CollectionStep collectionData={collection} />
                        </div>
                    </Skeleton>
                    {i < collections.length - 1 && <Divider />}
                </Fragment>
            );
        });
    }, [displaySkeletons, collections]);

    const variantStepsMemo = useMemo(() => {
        return relatedAttributesData.map((attribute, i) => {
            const { code: attributeCode, values } = attribute;
            if (values.length === 0) return null;
            return (
                <Fragment key={attributeCode}>
                    <Skeleton visible={displaySkeletons}>
                        <div
                            style={{
                                visibility: displaySkeletons ? "hidden" : "initial",
                            }}
                        >
                            <VariantStep product={productData} attribute={attribute} />
                        </div>
                    </Skeleton>
                    {i < relatedAttributesData.length - 1 && <Divider />}
                </Fragment>
            );
        });
    }, [productData, relatedAttributesData, displaySkeletons]);

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
                    <Skeleton visible={displaySkeletons} className={styles["margin"]}>
                        <h1
                            className={styles["product-name"]}
                            style={{ visibility: displaySkeletons ? "hidden" : "initial" }}
                        >
                            {name}
                        </h1>
                    </Skeleton>

                    <Skeleton visible={displaySkeletons} className={styles["margin"]}>
                        <div
                            className={styles["product-hero-rating-container"]}
                            style={{ visibility: displaySkeletons ? "hidden" : "initial" }}
                        >
                            {ratingMemo}
                        </div>
                    </Skeleton>

                    <Divider className={styles["margin"]} />

                    {(collectionStepsMemo.length > 0 || variantStepsMemo.length > 0) && (
                        <div
                            className={`${styles["product-hero-steps-container"]} ${styles["margin"]}`}
                        >
                            {collectionStepsMemo}

                            {collectionStepsMemo.length > 0 && <Divider />}

                            {variantStepsMemo}

                            {variantStepsMemo.length > 0 && <Divider />}
                        </div>
                    )}

                    <Skeleton visible={displaySkeletons} className={styles["margin"]}>
                        <div style={{ visibility: displaySkeletons ? "hidden" : "initial" }}>
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
                            disabled={displaySkeletons || maximumVariantQuantity === 0}
                        >
                            {narrow ? (
                                <>
                                    <Plus size={20} weight="bold" />
                                    <ShoppingCartSimple size={20} weight="bold" />
                                </>
                            ) : (
                                "Add to Cart"
                            )}
                        </Button>

                        {watchListButtonMemo}
                    </div>

                    <Skeleton visible={displaySkeletons}>
                        <div style={{ visibility: displaySkeletons ? "hidden" : "initial" }}>
                            {deliveryProgressMemo}
                        </div>
                    </Skeleton>
                </div>
            </div>
        </section>
    );
}
