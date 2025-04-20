import { createContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { RecommendedProducts } from "@/features/RecommendedProducts";
import {
    Product as ProductDataType,
    ProductReview,
    ProductVariant,
    findVariantFromOptions,
} from "@/utils/products/product";
import { mockGetProduct } from "@/api/product";
import { mockGetReview } from "@/api/review";
import styles from "./index.module.css";

export interface IProductContext {
    product: { data: ProductDataType | null; awaiting: boolean; status: number; message: string };
    variant: ProductVariant | null;
    selectedVariantOptions: ProductVariant["options"];
    setSelectedVariantOptions: React.Dispatch<React.SetStateAction<ProductVariant["options"]>>;
    reviews: ProductReview[];
}

const defaultProductContext: IProductContext = {
    product: { data: null, awaiting: true, status: 200, message: "Success" },
    variant: null,
    selectedVariantOptions: {},
    setSelectedVariantOptions: () => {},
    reviews: [],
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

export function Product() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { productSlug } = params;

    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );
    const productDataRef = useRef<IProductContext["product"]["data"]>(product.data);
    useEffect(() => {
        productDataRef.current = product.data;
    }, [product]);

    const [variant, setVariant] = useState<IProductContext["variant"]>(
        defaultProductContext.variant,
    );

    const [selectedVariantOptions, setSelectedVariantOptions] = useState<ProductVariant["options"]>(
        Object.fromEntries(searchParams.entries()),
    );
    const selectedVariantOptionsRef = useRef<ProductVariant["options"]>(selectedVariantOptions);
    useEffect(() => {
        selectedVariantOptionsRef.current = selectedVariantOptions;
    }, [selectedVariantOptions]);

    const [reviews, setReviews] = useState<IProductContext["reviews"]>(
        defaultProductContext.reviews,
    );

    const updateSelectedVariantData = useCallback(
        (productData: IProductContext["product"]["data"]) => {
            const newVariantData = productData
                ? findVariantFromOptions(productData, selectedVariantOptionsRef.current)
                : null;
            setVariant(newVariantData);
            if (
                newVariantData &&
                JSON.stringify(newVariantData.options) !==
                    JSON.stringify(selectedVariantOptionsRef.current)
            ) {
                setSelectedVariantOptions(newVariantData.options);
            }
        },
        [],
    );

    const getProductDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fetchProductData = useCallback(
        async (slug: string) => {
            await new Promise((resolve) => {
                getProductDataTimeoutRef.current = setTimeout(resolve, 1000);
            });

            getProductDataTimeoutRef.current = null;

            const response = {
                data: mockGetProduct(slug),
                awaiting: false,
                status: 200,
                message: "Success",
            };

            setProduct(response);
            updateSelectedVariantData(response.data);
        },
        [updateSelectedVariantData],
    );

    useEffect(() => {
        if (productSlug) {
            fetchProductData(productSlug);
            setProduct((curr) => ({ ...curr, awaiting: true }));
        } else {
            if (getProductDataTimeoutRef.current) {
                clearTimeout(getProductDataTimeoutRef.current);
                getProductDataTimeoutRef.current = null;
            }
            setProduct(defaultProductContext.product);
        }

        return () => {
            if (getProductDataTimeoutRef.current) {
                clearTimeout(getProductDataTimeoutRef.current);
            }
        };
    }, [productSlug, fetchProductData]);

    useEffect(() => {
        updateSelectedVariantData(productDataRef.current);
    }, [selectedVariantOptions, updateSelectedVariantData]);

    const getReviewsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fetchReviews = useCallback(async (ids: string[]) => {
        await new Promise((resolve) => {
            getReviewsTimeoutRef.current = setTimeout(resolve, 1000);
        });

        getReviewsTimeoutRef.current = null;

        const response = {
            data: ids.flatMap((id) => mockGetReview(id) || []),
            awaiting: false,
            status: 200,
            message: "Success",
        };

        setReviews(response.data);
    }, []);

    useEffect(() => {
        if (product.data) {
            fetchReviews(product.data.reviews);
        } else {
            if (getReviewsTimeoutRef.current) {
                clearTimeout(getReviewsTimeoutRef.current);
                getReviewsTimeoutRef.current = null;
            }
            setReviews([]);
        }

        return () => {
            if (getReviewsTimeoutRef.current) {
                clearTimeout(getReviewsTimeoutRef.current);
            }
        };
    }, [product, fetchReviews]);

    useEffect(() => {
        const newSearchParams = new URLSearchParams();
        Object.entries(selectedVariantOptions).forEach((entry) => {
            const [key, value] = entry;
            newSearchParams.set(key, value);
        });
        setSearchParams(newSearchParams);
    }, [setSearchParams, selectedVariantOptions]);

    return (
        <ProductContext.Provider
            value={useMemo(
                () => ({
                    product,
                    variant,
                    selectedVariantOptions,
                    setSelectedVariantOptions,
                    reviews,
                }),
                [product, variant, selectedVariantOptions, setSelectedVariantOptions, reviews],
            )}
        >
            <div className={styles["page"]}>
                <ProductHero />
                <ProductInformation />
                <RecommendedProducts />
            </div>
        </ProductContext.Provider>
    );
}
