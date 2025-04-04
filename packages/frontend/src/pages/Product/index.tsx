import { createContext, useState, useEffect, useRef, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { RecommendedProducts } from "@/features/RecommendedProducts";
import {
    Product as ProductDataType,
    ProductVariant,
    findVariantFromOptions,
} from "@/utils/products/product";
import { mockGetProductDataFromSlug } from "@/api/product";
import styles from "./index.module.css";

export interface IProductContext {
    product: { data: ProductDataType | null; awaiting: boolean; status: number; message: string };
    variant: ProductVariant | null;
    selectedVariantOptions: ProductVariant["options"];
    setSelectedVariantOptions: React.Dispatch<React.SetStateAction<ProductVariant["options"]>>;
}

const defaultProductContext: IProductContext = {
    product: { data: null, awaiting: true, status: 200, message: "Success" },
    variant: null,
    selectedVariantOptions: {},
    setSelectedVariantOptions: () => {},
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

export function Product() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { productSlug } = params;

    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );
    const [variant, setVariant] = useState<IProductContext["variant"]>(
        defaultProductContext.variant,
    );
    const [selectedVariantOptions, setSelectedVariantOptions] = useState<ProductVariant["options"]>(
        (() => {
            const optionsFromURL = Object.fromEntries(searchParams.entries());
            const foundVariantData = product.data
                ? findVariantFromOptions(product.data, optionsFromURL)
                : null;
            return foundVariantData ? foundVariantData.options : {};
        })(),
    );

    const getProductDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        const fetchProductData = async (slug: string) => {
            // Simulate API request delay
            await new Promise((resolve) => {
                getProductDataTimeoutRef.current = setTimeout(resolve, 1000);
            });

            getProductDataTimeoutRef.current = null;

            const response = {
                data: mockGetProductDataFromSlug(slug),
                awaiting: false,
                status: 200,
                message: "Success",
            };

            setProduct(response);
        };

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
    }, [productSlug]);

    useEffect(() => {
        const newVariantData = product.data
            ? findVariantFromOptions(product.data, selectedVariantOptions)
            : null;
        setVariant(newVariantData);
        if (
            newVariantData &&
            JSON.stringify(newVariantData.options) !== JSON.stringify(selectedVariantOptions)
        ) {
            setSelectedVariantOptions(newVariantData.options);
        }
    }, [product, selectedVariantOptions]);

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
                () => ({ product, variant, selectedVariantOptions, setSelectedVariantOptions }),
                [product, variant, selectedVariantOptions, setSelectedVariantOptions],
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
