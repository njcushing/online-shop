import { useContext, useState, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { Skeleton, Button, Divider, Rating } from "@mantine/core";
import { findCollections, filterVariantOptions } from "@/utils/products/product";
import { Quantity } from "@/components/Inputs/Quantity";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { Price } from "@/features/Price";
import { calculateMaxAddableVariantStock } from "@/utils/products/utils/calculateMaxAddableVariantStock";
import { ImageCarousel } from "./components/ImageCarousel";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
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

    const { response: cartResponse, awaiting: awaitingCart } = cart;
    const { response: productResponse, awaiting: awaitingProduct } = product;

    const { data: cartData } = cartResponse;
    const { data: productData } = productResponse;

    const variantOptions = useMemo<ReturnType<typeof filterVariantOptions>>(() => {
        if (awaitingProduct) return defaultVariantOptionsData;
        if (!productData || !variant) return new Map();
        return filterVariantOptions(productData, variant.options);
    }, [productData, variant, defaultVariantOptionsData, awaitingProduct]);

    const collectionsData = useMemo<ReturnType<typeof findCollections>>(() => {
        if (awaitingProduct) return defaultCollectionStepsData;
        return findCollections(productData?.id || "");
    }, [productData, defaultCollectionStepsData, awaitingProduct]);

    const [, /* quantity */ setQuantity] = useState<number | null>(1);

    const maximumVariantQuantity = useMemo(() => {
        if (!cartData || awaitingCart || !productData || awaitingProduct || !variant) return 0;
        return calculateMaxAddableVariantStock(cartData, productData, variant);
    }, [cartData, awaitingCart, productData, awaitingProduct, variant]);

    if (!awaitingProduct && (!productData || !variant)) return null;

    const { name, images, rating, variantOptionOrder } = !awaitingProduct
        ? productData!
        : (defaultProductData as NonNullable<IProductContext["product"]["data"]>);
    const { price, options } = !awaitingProduct
        ? variant!
        : (defaultVariantData as NonNullable<IProductContext["variant"]>);

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <div>
                    <ImageCarousel images={images.dynamic} awaiting={awaitingProduct} />
                </div>

                <div className={styles["product-content"]}>
                    <Skeleton visible={awaitingProduct} className={styles["margin"]}>
                        <h1
                            className={styles["product-name"]}
                            style={{ visibility: awaitingProduct ? "hidden" : "initial" }}
                        >
                            {name!.full}
                        </h1>
                    </Skeleton>

                    <Skeleton visible={awaitingProduct} className={styles["margin"]}>
                        <div
                            className={styles["product-hero-rating-container"]}
                            style={{ visibility: awaitingProduct ? "hidden" : "initial" }}
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
                                <Skeleton
                                    visible={awaitingProduct}
                                    key={collectionData.collection.id}
                                >
                                    <div
                                        style={{
                                            visibility: awaitingProduct ? "hidden" : "initial",
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
                                    <Skeleton visible={awaitingProduct} key={optionId}>
                                        <div
                                            style={{
                                                visibility: awaitingProduct ? "hidden" : "initial",
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

                    <Skeleton visible={awaitingProduct} className={styles["margin"]}>
                        <div style={{ visibility: awaitingProduct ? "hidden" : "initial" }}>
                            <Price base={price.base} current={price.current} size="lg" />
                        </div>
                    </Skeleton>

                    <VariantAlerts awaiting={awaitingProduct} />

                    <div
                        className={`${styles["product-hero-buttons-container"]} ${styles["margin"]}`}
                    >
                        <Quantity
                            defaultValue={1}
                            min={1}
                            max={Math.max(1, maximumVariantQuantity)}
                            disabled={
                                awaitingCart || awaitingProduct || maximumVariantQuantity === 0
                            }
                            onQuantityChange={(v) => setQuantity(v)}
                        />

                        <Button
                            color="#242424"
                            className={styles["add-to-cart-button"]}
                            disabled={
                                awaitingCart || awaitingProduct || maximumVariantQuantity === 0
                            }
                        >
                            Add to Cart
                        </Button>

                        <WatchlistButton />
                    </div>

                    <Skeleton visible={awaitingProduct}>
                        <div style={{ visibility: awaitingProduct ? "hidden" : "initial" }}>
                            <DeliveryProgress />
                        </div>
                    </Skeleton>
                </div>
            </div>
        </section>
    );
}
