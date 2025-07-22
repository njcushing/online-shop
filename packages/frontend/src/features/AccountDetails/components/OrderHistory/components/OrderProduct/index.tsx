import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, Image } from "@mantine/core";
import { variantOptions } from "@/utils/products/product";
import { PopulatedOrderData } from "@/utils/products/orders";
import { Price } from "@/features/Price";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

export type TOrderProduct = {
    data: PopulatedOrderData["products"][number];
};

export function OrderProduct({ data }: TOrderProduct) {
    const { orders } = useContext(UserContext);
    const { awaiting } = orders;

    const { product, variant, quantity, cost } = data;
    const { unit } = cost;

    const { id: productId, slug, name, images } = product;
    const { options, image } = variant;

    const usedImage = image || images.thumb;
    const { src, alt } = usedImage;

    const variantUrlParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => variantUrlParams.append(key, `${value}`));

    return (
        <li className={styles["order-product"]}>
            <Skeleton visible={awaiting}>
                <Image
                    className={styles["product-thumbnail-image"]}
                    src={src}
                    alt={alt}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>

            <div className={styles["product-information"]}>
                <Skeleton visible={awaiting}>
                    <Link
                        to={`/p/${productId}/${slug}?${variantUrlParams}`}
                        className={styles["product-full-name"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        {name.full}
                    </Link>
                </Skeleton>

                <div className={styles["product-variant-options"]}>
                    {Object.entries(options).map((option) => {
                        const [key, value] = option;
                        const variantOption = variantOptions.find((vOpt) => vOpt.id === key);
                        const variantOptionValue = variantOption?.values.find(
                            (vOptVal) => vOptVal.id === value,
                        );
                        return (
                            <Skeleton visible={awaiting} key={`${key}-skeleton`}>
                                <div
                                    className={styles["product-variant-option-info"]}
                                    key={key}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    <p className={styles["product-variant-option-name"]}>
                                        {variantOption?.name || key}:{" "}
                                    </p>
                                    <p className={styles["product-variant-option-value"]}>
                                        {variantOptionValue?.name || value}
                                    </p>
                                </div>
                            </Skeleton>
                        );
                    })}
                </div>

                <Skeleton visible={awaiting}>
                    <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                        <Price
                            base={unit}
                            current={unit}
                            classNames={{ container: styles["price-container"] }}
                        />
                    </div>
                </Skeleton>

                <Skeleton visible={awaiting} width="min-content" height="min-content">
                    <div
                        className={styles["quantity"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        <strong>Count: </strong>
                        <p>{quantity}</p>
                    </div>
                </Skeleton>
            </div>
        </li>
    );
}
