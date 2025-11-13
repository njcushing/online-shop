import { createContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { RecommendedProducts } from "@/features/RecommendedProducts";
import * as useAsync from "@/hooks/useAsync";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import {
    extractAttributesOrdered,
    extractRelatedAttributesOrdered,
    findVariantByAttributeParams,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";
import {
    getProductBySlug,
    ResponseBody as GetProductBySlugResponseDto,
} from "@/api/product/[slug]/GET";
import styles from "./index.module.css";

export interface IProductContext {
    product: useAsync.InferUseAsyncReturnTypeFromFunction<typeof getProductBySlug>;
    variant: GetProductBySlugResponseDto["variants"][number] | null;
    selectedAttributeParams: { [k: string]: string };
    setSelectedAttributeParams: React.Dispatch<React.SetStateAction<{ [k: string]: string }>>;
    allAttributes: ReturnType<typeof extractAttributesOrdered>;
    relatedAttributes: ReturnType<typeof extractRelatedAttributesOrdered>;

    defaultData: {
        product: RecursivePartial<GetProductBySlugResponseDto>;
        variant: RecursivePartial<GetProductBySlugResponseDto["variants"][number]>;
    };
}

const defaultProductContext: IProductContext = {
    product: createQueryContextObject({ awaiting: true }),
    variant: null,
    selectedAttributeParams: {},
    setSelectedAttributeParams: () => {},
    allAttributes: [],
    relatedAttributes: [],

    defaultData: {
        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
    },
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

const generateAttributeParamsFromVariant = (
    variant: GetProductBySlugResponseDto["variants"][number] | null,
): IProductContext["selectedAttributeParams"] => {
    const attributeParams: IProductContext["selectedAttributeParams"] = {};
    if (variant) {
        variant!.attributes.forEach((a) => {
            attributeParams[a.type.name] = a.value.code;
        });
    }
    return attributeParams;
};

const generateSearchParamsFromAttributeParams = (
    attributeParams: IProductContext["selectedAttributeParams"],
): URLSearchParams => {
    const searchParams = new URLSearchParams();
    Object.entries(attributeParams).forEach((entry) => {
        const [key, value] = entry;
        searchParams.set(key, value);
    });
    return searchParams;
};

export type TProduct = {
    children?: React.ReactNode;
};

export function Product({ children }: TProduct) {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { productSlug } = params;

    const [selectedAttributeParams, setSelectedAttributeParams] = useState<
        IProductContext["selectedAttributeParams"]
    >(Object.fromEntries(searchParams.entries()));
    const selectedAttributeParamsRef =
        useRef<IProductContext["selectedAttributeParams"]>(selectedAttributeParams);
    useEffect(() => {
        selectedAttributeParamsRef.current = selectedAttributeParams;
    }, [selectedAttributeParams]);

    const updateSelectedVariant = useCallback(
        (
            productData: typeof productDataRef.current,
        ): GetProductBySlugResponseDto["variants"][number] | null => {
            const newVariantData = productData
                ? findVariantByAttributeParams(productData, selectedAttributeParamsRef.current)
                : null;
            setVariant(newVariantData);
            return newVariantData;
        },
        [],
    );

    useEffect(() => {
        const newSearchParams = generateSearchParamsFromAttributeParams(selectedAttributeParams);
        setSearchParams(newSearchParams);
    }, [setSearchParams, selectedAttributeParams]);

    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );
    const [variant, setVariant] = useState<IProductContext["variant"]>(
        defaultProductContext.variant,
    );
    const getProductReturn = useAsync.GET(
        getProductBySlug,
        [{ params: { path: { slug: productSlug } } }] as Parameters<typeof getProductBySlug>,
        { attemptOnMount: true },
    );
    useEffect(() => {
        const { response, awaiting } = getProductReturn;
        setProduct(getProductReturn);
        const newVariant = updateSelectedVariant(response.success ? response.data : null);

        if (awaiting) return;

        const newSelectedAttributeParams = generateAttributeParamsFromVariant(newVariant);
        setSelectedAttributeParams(newSelectedAttributeParams);
        const newSearchParams = generateSearchParamsFromAttributeParams(newSelectedAttributeParams);
        setSearchParams(newSearchParams);
    }, [setSearchParams, updateSelectedVariant, getProductReturn]);
    const { response, setParams, attempt } = getProductReturn;

    const productDataRef = useRef<GetProductBySlugResponseDto | null>(
        response.success ? response.data : null,
    );
    useEffect(() => {
        productDataRef.current = response.success ? response.data : null;
    }, [response]);

    useMemo(() => {
        if (!productSlug) return;
        setParams([{ params: { path: { slug: productSlug } } }]);
        attempt();
    }, [productSlug, setParams, attempt]);

    useEffect(() => {
        updateSelectedVariant(productDataRef.current);
    }, [selectedAttributeParams, updateSelectedVariant]);

    const allAttributes = useMemo(() => {
        if (!response.success) return [];
        return extractAttributesOrdered(response.data);
    }, [response]);

    const relatedAttributes = useMemo(() => {
        if (!response.success || !variant) return [];
        return extractRelatedAttributesOrdered(response.data, variant);
    }, [response, variant]);

    return (
        <ProductContext.Provider
            value={useMemo(
                () => ({
                    product,
                    variant,
                    selectedAttributeParams,
                    setSelectedAttributeParams,
                    allAttributes,
                    relatedAttributes,

                    defaultData: defaultProductContext.defaultData,
                }),
                [
                    product,
                    variant,
                    selectedAttributeParams,
                    setSelectedAttributeParams,
                    allAttributes,
                    relatedAttributes,
                ],
            )}
        >
            <div className={styles["page"]}>
                <ProductHero />
                <ProductInformation />
                <RecommendedProducts />
            </div>
            {children}
        </ProductContext.Provider>
    );
}
