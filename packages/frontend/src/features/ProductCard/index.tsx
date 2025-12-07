import React, {
    forwardRef,
    useContext,
    useState,
    useCallback,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { RootContext } from "@/pages/Root";
import { Image, Rating, Tooltip, Skeleton } from "@mantine/core";
import { useIntersection, useMergedRef, useResizeObserver } from "@mantine/hooks";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import { ResponseBody as GetCategoryBySlugProductsResponseDto } from "@/api/categories/[slug]/products/GET";
import { ResponseBody as GetProductsBySearchResponseDto } from "@/api/products/search/GET";
import { ResponseBody as GetRelatedProductsBySlugResponseDto } from "@/api/products/[slug]/related/GET";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import dayjs from "dayjs";
import { Price } from "@/features/Price";
import styles from "./index.module.css";

export type TProductCard = {
    productData:
        | GetProductBySlugResponseDto
        | GetCategoryBySlugProductsResponseDto["products"][number]
        | GetProductsBySearchResponseDto[number]
        | GetRelatedProductsBySlugResponseDto[number];
    awaiting?: boolean;
    immediatelyVisible?: boolean;
};

export const ProductCard = forwardRef<HTMLAnchorElement, TProductCard>(
    ({ productData, awaiting = false, immediatelyVisible = false }: TProductCard, ref) => {
        const navigate = useNavigate();

        const { settings } = useContext(RootContext);

        let settingsData = null;

        const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
            contexts: [{ name: "settings", context: settings }],
        });

        if (!contextAwaitingAny) {
            if (data.settings) settingsData = data.settings;
        }

        const awaitingAny = awaiting || contextAwaitingAny;

        const containerRef = useRef<HTMLDivElement>(null);
        const { ref: productCardRef, entry: intersectionEntry } = useIntersection({
            root: containerRef.current,
            threshold: 0.2,
        });
        const mergedProductCardRef = useMergedRef(ref, productCardRef);
        const [visible, setVisible] = useState<boolean>(immediatelyVisible);
        useEffect(() => {
            if (awaitingAny) return;
            if (!visible) setVisible(intersectionEntry?.isIntersecting || false);
        }, [awaitingAny, intersectionEntry?.isIntersecting, visible]);

        const productInformationBanner = useCallback((): React.ReactNode | null => {
            const highestStockVariant = productData.variants.reduce(
                (min, variant) => (variant.stock > min ? variant.stock : min),
                productData.variants[0].stock,
            );
            const newestVariant = productData.variants.reduce(
                (curr, variant) => (variant.releaseDate > curr.releaseDate ? variant : curr),
                productData.variants[0],
            );

            // Out of stock
            if (highestStockVariant === 0) {
                return <div className={styles["product-information-banner"]}>Out of stock</div>;
            }

            // Low stock
            if (settingsData && highestStockVariant <= settingsData.lowStockThreshold) {
                return <div className={styles["product-information-banner"]}>Low stock</div>;
            }

            // New in stock (within last month)
            const daysInLastMonth = dayjs().subtract(1, "month").daysInMonth();
            if (
                dayjs(newestVariant.releaseDate).isAfter(dayjs().subtract(daysInLastMonth, "day"))
            ) {
                return <div className={styles["product-information-banner"]}>New in stock</div>;
            }

            return null;
        }, [productData, settingsData]);

        const lowestPriceVariant = useMemo<TProductCard["productData"]["variants"][number]>(() => {
            return productData.variants.reduce(
                (current, variant) =>
                    variant.priceCurrent < current.priceCurrent ? variant : current,
                productData.variants[0],
            );
        }, [productData]);

        const attributeButtonWidth = 32;
        const attributeButtonGap = 8;
        const [attributeContainerRef, attributeContainerRect] = useResizeObserver();
        const [attributeValueCount, setAttributeValueCount] = useState<number>(0);
        useEffect(() => {
            const { width } = attributeContainerRect;
            const newCount = Math.floor(
                (width + attributeButtonGap) / (attributeButtonWidth + attributeButtonGap) - 1,
            );
            setAttributeValueCount(newCount);
        }, [attributeContainerRect]);

        if (!lowestPriceVariant) return null;

        const { name, images, attributes } = productData;
        const displayAttribute = attributes.find((a) => a.type === "color");

        let usedImage = { id: "", src: "", alt: "", position: 0 };
        if (images.length > 0) [usedImage] = images;

        return (
            <Link
                to={`/p/${productData.slug}`}
                className={styles["product-card"]}
                data-visible={awaitingAny || visible}
                ref={mergedProductCardRef}
            >
                <Skeleton visible={awaitingAny}>
                    <div
                        className={styles["product-card-image-container"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        <Image
                            className={styles["product-image"]}
                            src={usedImage.src}
                            alt={usedImage.alt}
                        />
                        {productInformationBanner()}
                    </div>
                </Skeleton>

                <Skeleton visible={awaitingAny}>
                    <p
                        className={styles["product-name"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        {name}
                    </p>
                </Skeleton>

                <Skeleton visible={awaitingAny}>
                    <span style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                        <Price
                            base={lowestPriceVariant.priceBase}
                            current={lowestPriceVariant.priceCurrent}
                            size="md"
                        />
                    </span>
                </Skeleton>

                {displayAttribute && (
                    <div
                        className={styles["product-card-attribute-container"]}
                        style={{
                            gridTemplateColumns: `repeat(auto-fill, ${attributeButtonWidth}px)`,
                            gap: attributeButtonGap,
                        }}
                        ref={attributeContainerRef}
                    >
                        {displayAttribute.values.slice(0, attributeValueCount).map((v) => {
                            const { name: attributeName } = displayAttribute;
                            const { code, name: valueName, value } = v;

                            return (
                                <Tooltip
                                    label={`${attributeName}: ${valueName}`}
                                    withArrow
                                    className={styles["Tooltip"]}
                                    key={code}
                                >
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            navigate({
                                                pathname: `/p/${productData.slug}`,
                                                search: `?${attributeName}=${code}`,
                                            });
                                        }}
                                        className={styles["product-card-attribute-value-button"]}
                                        style={{ width: attributeButtonWidth }}
                                    >
                                        <div
                                            className={
                                                styles["product-card-attribute-value-color-box"]
                                            }
                                            style={{ backgroundColor: value }}
                                        ></div>
                                    </button>
                                </Tooltip>
                            );
                        })}

                        {attributeValueCount < displayAttribute.values.length && (
                            <div className={styles["product-card-attribute-value-remainder"]}>
                                {`+${displayAttribute.values.length - attributeValueCount}`}
                            </div>
                        )}
                    </div>
                )}

                <div className={styles["product-card-rating-container"]}>
                    <Skeleton visible={awaitingAny} width="min-content">
                        <span style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                            <Rating
                                className={styles["product-rating"]}
                                readOnly
                                count={5}
                                fractions={10}
                                value={productData.rating.average}
                                color="gold"
                                size="xs"
                            />
                        </span>
                    </Skeleton>
                    <Skeleton visible={awaitingAny} width="min-content">
                        <div
                            className={styles["product-rating-value"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            {productData.rating.average.toFixed(2)}
                        </div>
                    </Skeleton>
                    <Skeleton visible={awaitingAny} width="min-content">
                        <div
                            className={styles["product-rating-quantity"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >{`(${productData.rating.total})`}</div>
                    </Skeleton>
                </div>
            </Link>
        );
    },
);

ProductCard.displayName = "ProductCard";
