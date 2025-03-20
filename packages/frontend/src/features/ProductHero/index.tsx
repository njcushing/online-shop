import { useParams, useSearchParams } from "react-router-dom";
import { Fragment, useState, useMemo, useEffect } from "react";
import { Button, Divider, Image, Rating } from "@mantine/core";
import {
    Product,
    products,
    ProductVariant,
    filterVariantOptions,
    findVariant,
} from "@/utils/products/product";
import { v4 as uuid } from "uuid";
import { ErrorPage } from "@/pages/ErrorPage";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import { Inputs } from "@/components/Inputs";
import { VariantStep } from "./components/VariantStep";
import styles from "./index.module.css";

export function ProductHero() {
    const params = useParams();
    const [, /* searchParams */ setSearchParams] = useSearchParams();
    const { productId } = params;

    const productData = useMemo<Product | undefined>(() => {
        return products.find((product) => product.id === productId);
    }, [productId]);

    const [selectedOptions, setSelectedOptions] = useState<ProductVariant["options"]>({
        ...productData?.variants[0].options,
    });

    const variantData = useMemo<ProductVariant | null>(() => {
        const newVariantData = productData ? findVariant(productData, selectedOptions) : null;
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

    const [, /* quantity */ setQuantity] = useState<number | null>(1);

    if (!productData || !variantData) return <ErrorPage />;

    const { name, description, images, rating, allowance, variantOptionOrder } = productData;
    const { price, options } = variantData;

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <Image className={styles["product-image"]} src={images.dynamic[0] || ""} />

                <div className={styles["product-content"]}>
                    <h1 className={styles["product-name"]}>{name}</h1>

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

                    <div className={styles["product-buttons-container"]}>
                        <Inputs.Quantity min={1} max={allowance} onChange={(v) => setQuantity(v)} />

                        <Button className={styles["add-to-cart-button"]}>Add to Cart</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
