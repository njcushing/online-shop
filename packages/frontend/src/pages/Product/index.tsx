import { createContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { RecommendedProducts } from "@/features/RecommendedProducts";
import * as useAsync from "@/hooks/useAsync";
import {
    Product as ProductDataType,
    ProductVariant,
    findVariantFromOptions,
} from "@/utils/products/product";
import { mockGetProduct } from "@/api/product";
import { FuncResponseObject } from "@/api/types";
import styles from "./index.module.css";

export interface IProductContext {
    product: FuncResponseObject<ProductDataType> & { awaiting: boolean };
    variant: ProductVariant | null;
    selectedVariantOptions: ProductVariant["options"];
    setSelectedVariantOptions: React.Dispatch<React.SetStateAction<ProductVariant["options"]>>;
}

const defaultProductContext: IProductContext = {
    product: { data: null, status: 200, message: "Success", awaiting: true },
    variant: null,
    selectedVariantOptions: {},
    setSelectedVariantOptions: () => {},
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

export function Product() {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { productId } = params;

    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );
    const productDataRef = useRef<ProductDataType | null>(product.data);
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

    const updateSelectedVariantData = useCallback((productData: ProductDataType | null) => {
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
    }, []);

    const { response, setParams, attempt, awaiting } = useAsync.GET(
        mockGetProduct,
        [{ params: { productId } }],
        { attemptOnMount: true },
    );

    useMemo(() => {
        setParams([{ params: { productId } }]);
        attempt();
    }, [productId, setParams, attempt]);

    useEffect(() => {
        setProduct({ ...response, awaiting });
        updateSelectedVariantData(response?.data || null);
    }, [updateSelectedVariantData, response, awaiting]);

    useEffect(() => {
        updateSelectedVariantData(productDataRef.current);
    }, [selectedVariantOptions, updateSelectedVariantData]);

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
                }),
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
