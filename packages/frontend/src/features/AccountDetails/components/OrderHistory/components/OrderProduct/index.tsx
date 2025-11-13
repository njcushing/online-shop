import { Skeleton, Image } from "@mantine/core";
import { OrderData } from "@/utils/products/orders";
import { Price } from "@/features/Price";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

export type TOrderProduct = {
    data: OrderData["products"][number];
    awaiting: boolean;
};

export function OrderProduct({ data, awaiting }: TOrderProduct) {
    const { product, variant, quantity, cost } = data;
    const { unit } = cost;

    const { id: productId, slug, name, images: productImages } = product;
    const { attributes, images: variantImages } = variant;

    let usedImage = { id: "", src: "", alt: "", position: 0 };
    if (productImages.length > 0) [usedImage] = productImages;
    if (variantImages.length > 0) [usedImage] = variantImages;

    const variantUrlParams = new URLSearchParams();
    attributes.forEach((a) => variantUrlParams.append(a.type.name, `${a.value.code}`));

    return (
        <li className={styles["order-product"]}>
            <Skeleton visible={awaiting}>
                <Image
                    className={styles["product-thumbnail-image"]}
                    src={usedImage.src}
                    alt={usedImage.alt}
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
                        {name}
                    </Link>
                </Skeleton>

                <div className={styles["product-variant-options"]}>
                    {attributes.map((attribute) => {
                        const { type, value } = attribute;
                        return (
                            <Skeleton visible={awaiting} key={`${type.name}-skeleton`}>
                                <div
                                    className={styles["product-variant-option-info"]}
                                    key={type.name}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    <p className={styles["product-variant-option-name"]}>
                                        {type.title}:{" "}
                                    </p>
                                    <p className={styles["product-variant-option-value"]}>
                                        {value.name}
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
