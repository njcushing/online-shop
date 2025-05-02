import { useContext, useState, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { Skeleton, Button, Divider, Rating } from "@mantine/core";
import {
    Product,
    ProductVariant,
    findCollections,
    filterVariantOptions,
} from "@/utils/products/product";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import { Inputs } from "@/components/Inputs";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { RecursivePartial } from "@/utils/types";
import { ImageCarousel } from "./components/ImageCarousel";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
import { VariantAlerts } from "./components/VariantAlerts";
import styles from "./index.module.css";

const defaultProductData: RecursivePartial<NonNullable<IProductContext["product"]["data"]>> = {
    name: { full: "Product Name" },
    images: { thumb: "", dynamic: ["a", "b", "c", "d", "e"] },
    rating: { meanValue: 5.0, totalQuantity: 100, quantities: { 5: 90, 4: 6, 3: 2, 2: 1, 1: 1 } },
    variantOptionOrder: ["option"],
};

const defaultProductVariantData: RecursivePartial<NonNullable<IProductContext["variant"]>> = {
    price: { base: 1000, current: 1000 },
    options: {},
};

const defaultVariantOptionsData: ReturnType<typeof filterVariantOptions> = new Map([
    ["option", new Set(["1", "2", "3"])],
]);

const defaultCollectionStepsData: ReturnType<typeof findCollections> = [
    {
        collection: { id: "", type: "quantity" },
        products: Array.from({ length: 3 }).map((v, i) => {
            return {
                id: "",
                name: {
                    full: "Product Name",
                    shorthands: [{ type: "quantity", value: `Shorthand ${i}` }],
                },
                description: "",
                slug: "",
                images: { thumb: "", dynamic: [] },
                rating: {
                    meanValue: 0.0,
                    totalQuantity: 0,
                    quantities: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
                },
                allowance: 0,
                tags: [],
                variants: [],
                variantOptionOrder: [],
                customisations: [],
                reviews: [],
                releaseDate: "",
            };
        }),
    },
];

const calculateMaximumVariantQuantity = (
    cart: PopulatedCartItemData[],
    product: Product,
    variant: ProductVariant,
): number => {
    const { allowance } = product;
    const { stock, allowanceOverride } = variant;
    const allowanceOverrideIsNumber = !Number.isNaN(Number(allowanceOverride));

    const cartItem = cart.find((item) => item.variant.id === variant.id);
    if (!cartItem) {
        return Math.min(
            stock,
            allowanceOverrideIsNumber ? (allowanceOverride as number) : allowance,
        );
    }
    const { quantity } = cartItem;

    if (allowanceOverrideIsNumber) {
        return Math.max(0, Math.min(stock, (allowanceOverride as number) - quantity));
    }
    return Math.max(0, Math.min(stock, allowance - quantity));
};

export function ProductHero() {
    const { cart } = useContext(UserContext);
    const { product, variant, selectedVariantOptions, setSelectedVariantOptions } =
        useContext(ProductContext);

    const { awaiting } = product;

    const variantOptions = useMemo<ReturnType<typeof filterVariantOptions> | null>(() => {
        if (awaiting) return defaultVariantOptionsData;
        if (!product.data || !variant) return null;
        return product.data ? filterVariantOptions(product.data, variant?.options) : null;
    }, [product.data, variant, awaiting]);

    const collectionsData = useMemo<ReturnType<typeof findCollections>>(() => {
        if (awaiting) return defaultCollectionStepsData;
        return findCollections(product.data?.id || "");
    }, [product, awaiting]);

    const [, /* quantity */ setQuantity] = useState<number | null>(1);

    const maximumVariantQuantity = useMemo(() => {
        if (!product.data || !variant) return 0;
        return calculateMaximumVariantQuantity(cart.data || [], product.data, variant);
    }, [cart, product.data, variant]);

    if (!awaiting && (!product.data || !variant)) return null;

    const { name, images, rating, variantOptionOrder } = !awaiting
        ? product.data!
        : (defaultProductData as NonNullable<IProductContext["product"]["data"]>);
    const { price, options } = !awaiting
        ? variant!
        : (defaultProductVariantData as NonNullable<IProductContext["variant"]>);

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <Skeleton visible={awaiting}>
                    <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                        <ImageCarousel images={images.dynamic} />
                    </div>
                </Skeleton>

                <div className={styles["product-content"]}>
                    <Skeleton visible={awaiting}>
                        <h1
                            className={styles["product-name"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            {name!.full}
                        </h1>
                    </Skeleton>

                    <Skeleton visible={awaiting}>
                        <div
                            className={styles["product-hero-rating-container"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
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

                    <Divider />

                    {(collectionsData.length > 0 || variantOptionOrder.length > 0) && (
                        <div className={styles["product-hero-steps-container"]}>
                            {collectionsData.map((collectionData, i) => {
                                const step = <CollectionStep collectionData={collectionData} />;
                                return (
                                    <Skeleton visible={awaiting} key={collectionData.collection.id}>
                                        {step}
                                        {i < collectionsData.length - 1 && <Divider />}
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
                                            selected={options[optionId] || ""}
                                            onClick={(value) => {
                                                const newselectedVariantOptions = {
                                                    ...selectedVariantOptions,
                                                };
                                                newselectedVariantOptions[optionId] = value;
                                                setSelectedVariantOptions(
                                                    newselectedVariantOptions,
                                                );
                                            }}
                                        />
                                    );
                                    return (
                                        <Skeleton visible={awaiting} key={optionId}>
                                            {step}
                                            {i < variantOptions.size - 1 && <Divider />}
                                        </Skeleton>
                                    );
                                })}

                            {variantOptionOrder.length > 0 && <Divider />}
                        </div>
                    )}

                    <Skeleton visible={awaiting}>
                        <div
                            className={styles["product-hero-price-container"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            <span className={styles["product-price-current"]}>
                                £{(price.current / 100).toFixed(2)}
                            </span>

                            {price.current !== price.base && (
                                <>
                                    <span className={styles["product-price-base"]}>
                                        £{(price.base / 100).toFixed(2)}
                                    </span>
                                    <span className={styles["product-price-discount-percentage"]}>
                                        {createPriceAdjustmentString(price.current, price.base)}
                                    </span>
                                </>
                            )}
                        </div>
                    </Skeleton>

                    <VariantAlerts />

                    <div className={styles["product-hero-buttons-container"]}>
                        <Inputs.Quantity
                            min={1}
                            max={Math.max(1, maximumVariantQuantity)}
                            disabled={maximumVariantQuantity === 0}
                            onChange={(v) => setQuantity(v)}
                        />

                        <Button
                            color="#242424"
                            className={styles["add-to-cart-button"]}
                            disabled={maximumVariantQuantity === 0}
                        >
                            Add to Cart
                        </Button>
                    </div>

                    <Skeleton visible={awaiting}>
                        <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            <DeliveryProgress />
                        </div>
                    </Skeleton>
                </div>
            </div>
        </section>
    );
}
