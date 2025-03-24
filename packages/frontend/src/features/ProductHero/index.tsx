import { useParams, useSearchParams } from "react-router-dom";
import { Fragment, useContext, useState, useMemo, useEffect } from "react";
import { UserContext } from "@/pages/Root";
import { Button, Divider, Image, Rating, Alert, AlertProps } from "@mantine/core";
import {
    Product,
    ProductVariant,
    findProductFromSlug,
    findCollections,
    filterVariantOptions,
    findVariantFromOptions,
    lowStockThreshold,
} from "@/utils/products/product";
import { CartItemData, mockCart, PopulatedCartItemData } from "@/utils/products/cart";
import { v4 as uuid } from "uuid";
import { ErrorPage } from "@/pages/ErrorPage";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import { Inputs } from "@/components/Inputs";
import { WarningCircle, Info } from "@phosphor-icons/react";
import { CollectionStep } from "./components/CollectionStep";
import { VariantStep } from "./components/VariantStep";
import { DeliveryProgress } from "./components/DeliveryProgress";
import styles from "./index.module.css";

const AlertClassNames: AlertProps["classNames"] = {
    root: styles["alert-root"],
    wrapper: styles["alert-wrapper"],
    body: styles["alert-body"],
    title: styles["alert-title"],
    icon: styles["alert-icon"],
};

const calculateMaximumProductQuantity = (
    cart: PopulatedCartItemData[],
    product: Product,
    variant: ProductVariant,
): number => {
    const { allowance } = product;
    const { allowanceOverride } = variant;

    const cartItem = cart.find((item) => item.variant.id === variant.id);
    if (!cartItem) return 0;
    if (allowanceOverride) return Math.max(0, allowanceOverride - cartItem.quantity);
    return Math.max(0, allowance - cartItem.quantity);
};

export function ProductHero() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { productSlug } = params;

    const { cart } = useContext(UserContext);

    const productData = useMemo<Product | undefined>(() => {
        return findProductFromSlug(productSlug || "");
    }, [productSlug]);

    const [selectedOptions, setSelectedOptions] = useState<ProductVariant["options"]>(
        (() => {
            const optionsFromURL = Object.fromEntries(searchParams.entries());
            const foundVariantData = productData
                ? findVariantFromOptions(productData, optionsFromURL)
                : null;
            return foundVariantData ? foundVariantData.options : {};
        })(),
    );

    const variantData = useMemo<ProductVariant | null>(() => {
        const newVariantData = productData
            ? findVariantFromOptions(productData, selectedOptions)
            : null;
        if (!newVariantData) return null;
        if (JSON.stringify(newVariantData.options) !== JSON.stringify(selectedOptions)) {
            setSelectedOptions(newVariantData.options);
        }
        return newVariantData;
    }, [productData, selectedOptions]);

    useEffect(() => {
        const newSearchParams = new URLSearchParams();
        Object.entries(selectedOptions).forEach((entry) => {
            const [key, value] = entry;
            newSearchParams.set(key, value);
        });
        setSearchParams(newSearchParams);
    }, [setSearchParams, selectedOptions]);

    const variantOptions = useMemo<Map<string, Set<string>> | null>(() => {
        return productData ? filterVariantOptions(productData, selectedOptions) : null;
    }, [productData, selectedOptions]);

    const collectionsData = useMemo<ReturnType<typeof findCollections>>(() => {
        return findCollections(productData?.id || "");
    }, [productData?.id]);

    const cartItemData = useMemo<CartItemData | undefined>(() => {
        return mockCart.find((cartItem) => cartItem.variantId === variantData?.id);
    }, [variantData?.id]);

    const [, /* quantity */ setQuantity] = useState<number | null>(1);

    if (!productData || !variantData) return <ErrorPage />;

    const { name, description, images, rating, variantOptionOrder } = productData;
    const { price, stock, options } = variantData;

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <Image className={styles["product-image"]} src={images.dynamic[0] || ""} />

                <div className={styles["product-content"]}>
                    <h1 className={styles["product-name"]}>{name.full}</h1>

                    <Divider />

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

                    <div className={styles["product-description-container"]}>
                        {description.map((paragraph) => {
                            return (
                                <p className={styles["product-description"]} key={uuid()}>
                                    {paragraph}
                                </p>
                            );
                        })}
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
                                            const newSelectedOptions = { ...selectedOptions };
                                            newSelectedOptions[optionId] = value;
                                            setSelectedOptions(newSelectedOptions);
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
                            max={calculateMaximumProductQuantity(
                                cart.data,
                                productData,
                                variantData,
                            )}
                            disabled={stock === 0}
                            onChange={(v) => setQuantity(v)}
                        />

                        <Button
                            color="#242424"
                            className={styles["add-to-cart-button"]}
                            disabled={stock === 0}
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
