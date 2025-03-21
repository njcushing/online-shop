import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { findCollections } from "@/utils/products/product";
import { Image } from "@mantine/core";
import styles from "./index.module.css";

export type TCollectionStep = {
    collectionData: ReturnType<typeof findCollections>[number];
};

export function CollectionStep({ collectionData }: TCollectionStep) {
    const params = useParams();
    const { productSlug: URLProductSlug } = params;

    const { collection, products } = collectionData;
    const { id, type } = collection;

    const title = useMemo<string>(() => {
        if (type === "quantity") return "Select a quantity";
        return "Other products in this collection";
    }, [type]);

    const items = useMemo(() => {
        return products.map((product) => {
            const { slug: productSlug, images, name } = product;
            const { thumb } = images;
            const { full, shorthands } = name;
            const shorthand = shorthands.find((entry) => entry.type === type)?.value;
            const usedName = shorthand || full;
            return (
                <Link
                    to={`/p/${productSlug}`}
                    className={styles["product-hero-step-product-link"]}
                    data-selected={productSlug === URLProductSlug}
                    tabIndex={productSlug === URLProductSlug ? -1 : 0}
                    key={`variant-options-${id}-${usedName}`}
                >
                    <Image className={styles["product-thumbnail-image"]} src={thumb || ""} />
                    {usedName}
                </Link>
            );
        });
    }, [URLProductSlug, products, id, type]);

    return (
        <div className={styles["product-hero-step"]}>
            <p className={styles["product-hero-step-title"]}>{title}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
