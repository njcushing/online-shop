import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Collection, findCollections } from "@/utils/products/product";
import { Image } from "@mantine/core";
import styles from "./index.module.css";

export type TCollectionStep = {
    collectionData: ReturnType<typeof findCollections>[number];
};

const getTitle = (type: Collection["type"]): string => {
    if (type === "quantity") return "Select a quantity";
    return "Other products in this collection";
};

export function CollectionStep({ collectionData }: TCollectionStep) {
    const params = useParams();
    const { productId: URLProductId } = params;

    const { collection, products } = collectionData;
    const { id, type } = collection;

    const items = useMemo(() => {
        return products.map((product) => {
            const { id: productId, slug: productSlug, images, name } = product;
            const { thumb } = images;
            const { full, shorthands } = name;
            const shorthand = shorthands.find((entry) => entry.type === type)?.value;
            const usedName = shorthand || full;

            const isSelected = productId === URLProductId;

            return (
                <Link
                    to={`/p/${productId}/${productSlug}`}
                    className={styles["product-hero-step-product-link"]}
                    data-selected={isSelected}
                    tabIndex={isSelected ? -1 : 0}
                    key={`variant-options-${id}-${usedName}`}
                >
                    <Image
                        className={styles["product-thumbnail-image"]}
                        src={thumb.src}
                        alt={thumb.alt}
                    />
                    {usedName}
                </Link>
            );
        });
    }, [URLProductId, products, id, type]);

    return (
        <div className={styles["product-hero-step"]}>
            <p className={styles["product-hero-step-title"]}>{getTitle(type)}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
