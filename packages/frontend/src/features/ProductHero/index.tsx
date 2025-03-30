import { Fragment, useContext, useState, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Button, Divider, Rating, Alert, AlertProps } from "@mantine/core";
import {
    Product,
    ProductVariant,
    findCollections,
    filterVariantOptions,
    lowStockThreshold,
} from "@/utils/products/product";
import { CartItemData, mockCart, PopulatedCartItemData } from "@/utils/products/cart";
import { ErrorPage } from "@/pages/ErrorPage";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import { Inputs } from "@/components/Inputs";
import { WarningCircle, Info } from "@phosphor-icons/react";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { ImageCarousel } from "./components/ImageCarousel";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
import styles from "./index.module.css";

const AlertClassNames: AlertProps["classNames"] = {
    root: styles["alert-root"],
    wrapper: styles["alert-wrapper"],
    body: styles["alert-body"],
    title: styles["alert-title"],
    icon: styles["alert-icon"],
};

const calculateMaximumVariantQuantity = (
    cart: PopulatedCartItemData[],
    product: Product,
    variant: ProductVariant,
): number => {
    const { allowance } = product;
    const { stock, allowanceOverride } = variant;

    const cartItem = cart.find((item) => item.variant.id === variant.id);
    if (!cartItem) return Math.min(stock, allowanceOverride || allowance);
    const { quantity } = cartItem;

    if (allowanceOverride) return Math.max(0, Math.min(stock, allowanceOverride - quantity));
    return Math.max(0, Math.min(stock, allowance - quantity));
};

export function ProductHero() {
    const { cart } = useContext(UserContext);
    const { product, variant, selectedVariantOptions, setSelectedVariantOptions } =
        useContext(ProductContext);

    const variantOptions = useMemo<Map<string, Set<string>> | null>(() => {
        return product.data ? filterVariantOptions(product.data, selectedVariantOptions) : null;
    }, [product.data, selectedVariantOptions]);

    const collectionsData = useMemo<ReturnType<typeof findCollections>>(() => {
        return findCollections(product.data?.id || "");
    }, [product.data?.id]);

    const cartItemData = useMemo<CartItemData | undefined>(() => {
        return mockCart.find((cartItem) => cartItem.variantId === variant?.id);
    }, [variant?.id]);

    const [, /* quantity */ setQuantity] = useState<number | null>(1);

    const maximumVariantQuantity = useMemo(() => {
        if (!product.data || !variant) return 0;
        return calculateMaximumVariantQuantity(cart.data, product.data, variant);
    }, [cart, product.data, variant]);

    if (!product.data || !variant) return <ErrorPage />;

    const { name, images, rating, variantOptionOrder } = product.data;
    const { price, stock, options } = variant;

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <ImageCarousel images={images.dynamic} />

                <div className={styles["product-content"]}>
                    <h1 className={styles["product-name"]}>{name.full}</h1>

                    <div className={styles["product-hero-rating-container"]}>
                        <Rating
                            className={styles["product-rating"]}
                            readOnly
                            count={5}
                            fractions={10}
                            value={rating.value}
                            color="gold"
                            size="sm"
                        />
                        <div className={styles["product-rating-value"]}>
                            {rating.value.toFixed(2)}
                        </div>
                        <div
                            className={styles["product-rating-quantity"]}
                        >{`(${rating.quantity})`}</div>
                    </div>

                    <Divider />

                    <div className={styles["product-hero-steps-container"]}>
                        {collectionsData.map((collectionData, i) => {
                            const step = <CollectionStep collectionData={collectionData} />;
                            return (
                                <Fragment key={collectionData.collection.id}>
                                    {step}
                                    {i < collectionsData.length - 1 && <Divider />}
                                </Fragment>
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
                                            setSelectedVariantOptions(newselectedVariantOptions);
                                        }}
                                    />
                                );
                                return (
                                    <Fragment key={optionId}>
                                        {step}
                                        {i < variantOptions.size - 1 && <Divider />}
                                    </Fragment>
                                );
                            })}
                    </div>

                    <Divider />

                    <div className={styles["product-hero-price-container"]}>
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

                    {(() => {
                        if (stock === 0) {
                            return (
                                <Alert
                                    color="red"
                                    icon={<WarningCircle weight="bold" size="100%" />}
                                    title="Out of stock"
                                    classNames={AlertClassNames}
                                >
                                    <p>
                                        We are unsure when this item will be back in stock. Check
                                        back soon, or add this item to your watchlist to be notified
                                        when it comes back in stock.
                                    </p>
                                </Alert>
                            );
                        }
                        if (stock <= lowStockThreshold) {
                            return (
                                <Alert
                                    color="yellow"
                                    icon={<WarningCircle weight="bold" size="100%" />}
                                    title="Low stock"
                                    classNames={AlertClassNames}
                                >
                                    <p>
                                        There {stock === 1 ? "is" : "are"} only{" "}
                                        <span style={{ fontWeight: "bold" }}>{stock}</span> of this
                                        item left in stock.
                                    </p>
                                </Alert>
                            );
                        }
                        return null;
                    })()}

                    {cartItemData && (
                        <Alert
                            icon={<Info weight="bold" size="100%" />}
                            classNames={AlertClassNames}
                        >
                            You already have{" "}
                            <span style={{ fontWeight: "bold" }}>{cartItemData.quantity}</span> of
                            this item in your cart.
                        </Alert>
                    )}

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

                    <DeliveryProgress />
                </div>
            </div>
        </section>
    );
}
