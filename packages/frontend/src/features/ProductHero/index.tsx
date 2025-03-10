import { useState, useMemo } from "react";
import { Button, Divider, Image, Rating } from "@mantine/core";
import { generateMockProduct } from "@/utils/products/product";
import { v4 as uuid } from "uuid";
import styles from "./index.module.css";

const mockProductData = generateMockProduct();

export function ProductHero() {
    const { name, description, img, price, rating, allowance } = mockProductData;

    const [quantity, setQuantity] = useState<number>(1);

    const priceReductionString = useMemo<string>(() => {
        const reduction = (price.current / Math.max(price.base, 1)) * 100 - 100;
        return `${reduction < 0 ? "" : "+"}${reduction.toFixed(0)}%`;
    }, [price]);

    return (
        <section className={styles["product-hero"]}>
            <div className={styles["product-hero-width-controller"]}>
                <Image className={styles["product-image"]} src={img} />
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
                                    {priceReductionString}
                                </span>
                            </>
                        )}
                    </div>
                    <div className={styles["product-buttons-container"]}>
                        <div className={styles["quantity-input-container"]}>
                            <Button
                                variant="transparent"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className={styles["increment-button-down"]}
                                style={{ padding: "0px" }}
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
                                value={quantity}
                                onBlur={(e) => {
                                    const value = Number(e.currentTarget.value);
                                    if (Number.isNaN(value) || !Number.isInteger(value)) {
                                        setQuantity(1);
                                    } else {
                                        setQuantity(Math.max(1, Math.min(allowance, value)));
                                    }
                                }}
                                onChange={(e) => {
                                    const { value } = e.currentTarget;
                                    if (/^\d+$/.test(value)) {
                                        setQuantity(Number.parseInt(value, 10));
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (
                                        !/^[0-9]$/.test(e.key) &&
                                        ![
                                            "Backspace",
                                            "ArrowLeft",
                                            "ArrowRight",
                                            "Delete",
                                        ].includes(e.key)
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onInput={(e) => {
                                    const { value } = e.currentTarget;
                                    e.currentTarget.value = value.replace(/[^0-9]/g, "");
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
                                onClick={() => setQuantity(Math.min(allowance, quantity + 1))}
                                className={styles["increment-button-up"]}
                                style={{ padding: "0px" }}
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
                        <Button>Add to Cart</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
