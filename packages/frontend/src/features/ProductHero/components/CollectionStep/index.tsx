import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Image } from "@mantine/core";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import styles from "./index.module.css";

export type TCollectionStep = {
    collectionData: GetProductBySlugResponseDto["collections"][number];
};

export function CollectionStep({ collectionData }: TCollectionStep) {
    const params = useParams();
    const { productSlug: URLProductSlug } = params;

    const { title, products } = collectionData;

    const items = useMemo(() => {
        return products.map((product) => {
            const { id: productId, slug: productSlug, images, name: productName } = product;

            const isSelected = productSlug === URLProductSlug;

            let usedImage = { id: "", src: "", alt: "", position: 0 };
            if (images.length > 0) [usedImage] = images;

            return (
                <Link
                    to={`/p/${productSlug}`}
                    className={styles["product-hero-step-product-link"]}
                    data-selected={isSelected}
                    tabIndex={isSelected ? -1 : 0}
                    key={`variant-options-${productId}-${productName}`}
                >
                    <Image
                        className={styles["product-thumbnail-image"]}
                        src={usedImage.src}
                        alt={usedImage.alt}
                    />
                    {productName}
                </Link>
            );
        });
    }, [URLProductSlug, products]);

    return (
        <div className={styles["product-hero-step"]}>
            <p className={styles["product-hero-step-title"]}>{title}</p>
            <div className={styles["product-hero-step-options"]}>{items}</div>
        </div>
    );
}
