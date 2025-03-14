import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button, Divider, Image, Rating } from "@mantine/core";
import { Product, products, ProductVariant } from "@/utils/products/product";
import { v4 as uuid } from "uuid";
import { ErrorPage } from "@/pages/ErrorPage";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import styles from "./index.module.css";

export function ProductHero() {
    const params = useParams();
    const { productId } = params;

    const [quantity, setQuantity] = useState<number | null>(1);

    const productData = useMemo<Product | undefined>(() => {
        return products.find((product) => product.id === productId);
    }, [productId]);

    const variantData = useMemo<ProductVariant | undefined>(() => {
        if (!productData) return undefined;
        if (productData.variants.length === 0) return undefined;
        return productData.variants[0];
    }, [productData]);

    if (!productData || !variantData) return <ErrorPage />;

    const { name, description, images, rating, allowance } = productData;
    const { price } = variantData;

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
                        <div className={styles["product-hero-step"]}>
                            <p className={styles["product-hero-step-title"]}>Step 1</p>
                            <ul className={styles["product-hero-step-options"]}>
                                <li className={styles["product-hero-step-option"]}>Option 1</li>
                                <li className={styles["product-hero-step-option"]}>Option 2</li>
                                <li className={styles["product-hero-step-option"]}>Option 3</li>
                                <li className={styles["product-hero-step-option"]}>Option 4</li>
                                <li className={styles["product-hero-step-option"]}>Option 5</li>
                                <li className={styles["product-hero-step-option"]}>Option 6</li>
                            </ul>
                        </div>

                        <Divider />
                        <div className={styles["product-hero-step"]}>
                            <p className={styles["product-hero-step-title"]}>Step 2</p>
                            <ul className={styles["product-hero-step-options"]}>
                                <li className={styles["product-hero-step-option"]}>Option 1</li>
                                <li className={styles["product-hero-step-option"]}>Option 2</li>
                                <li className={styles["product-hero-step-option"]}>Option 3</li>
                                <li className={styles["product-hero-step-option"]}>Option 4</li>
                                <li className={styles["product-hero-step-option"]}>Option 5</li>
                                <li className={styles["product-hero-step-option"]}>Option 6</li>
                            </ul>
                        </div>

                        <Divider />

                        <div className={styles["product-hero-step"]}>
                            <p className={styles["product-hero-step-title"]}>Step 3</p>
                            <ul className={styles["product-hero-step-options"]}>
                                <li className={styles["product-hero-step-option"]}>Option 1</li>
                                <li className={styles["product-hero-step-option"]}>Option 2</li>
                                <li className={styles["product-hero-step-option"]}>Option 3</li>
                                <li className={styles["product-hero-step-option"]}>Option 4</li>
                                <li className={styles["product-hero-step-option"]}>Option 5</li>
                                <li className={styles["product-hero-step-option"]}>Option 6</li>
                            </ul>
                        </div>

                        <Divider />

                        <div className={styles["product-hero-step"]}>
                            <p className={styles["product-hero-step-title"]}>Step 4</p>
                            <ul className={styles["product-hero-step-options"]}>
                                <li className={styles["product-hero-step-option"]}>Option 1</li>
                                <li className={styles["product-hero-step-option"]}>Option 2</li>
                                <li className={styles["product-hero-step-option"]}>Option 3</li>
                                <li className={styles["product-hero-step-option"]}>Option 4</li>
                                <li className={styles["product-hero-step-option"]}>Option 5</li>
                                <li className={styles["product-hero-step-option"]}>Option 6</li>
                            </ul>
                        </div>
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
                        <div className={styles["quantity-input-container"]}>
                            <Button
                                variant="transparent"
                                onClick={() => quantity && setQuantity(Math.max(1, quantity - 1))}
                                className={styles["decrement-button"]}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    stroke="black"
                                    strokeWidth="2"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </Button>

                            <input
                                type="number"
                                value={quantity === null ? "" : quantity}
                                onBlur={(e) => {
                                    const value = e.currentTarget.value.trim();
                                    if (
                                        value === "" ||
                                        Number.isNaN(Number(value)) ||
                                        !Number.isInteger(Number(value))
                                    ) {
                                        setQuantity(1);
                                    } else {
                                        setQuantity(
                                            Math.max(1, Math.min(allowance, Number(value))),
                                        );
                                    }
                                    e.preventDefault();
                                }}
                                onChange={(e) => {
                                    const { value } = e.currentTarget;
                                    if (value === "" || /^\d+$/.test(value)) {
                                        setQuantity(
                                            value === "" ? null : Number.parseInt(value, 10),
                                        );
                                    }
                                }}
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(
                                        /[^0-9]/g,
                                        "",
                                    );
                                }}
                                onPaste={(e) => {
                                    if (!/^\d+$/.test(e.clipboardData.getData("text"))) {
                                        e.preventDefault();
                                    }
                                }}
                                min={1}
                                max={allowance}
                                step={1}
                                className={styles["quantity-input"]}
                            />

                            <Button
                                variant="transparent"
                                onClick={() =>
                                    quantity && setQuantity(Math.min(allowance, quantity + 1))
                                }
                                className={styles["increment-button"]}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    stroke="black"
                                    strokeWidth="2"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </Button>
                        </div>

                        <Button className={styles["add-to-cart-button"]}>Add to Cart</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
