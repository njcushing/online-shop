import { createContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { CoffeeBlendInfoPanels } from "@/features/CoffeeBlendInfoPanels";
import { RecommendedProducts } from "@/features/RecommendedProducts";
import * as useAsync from "@/hooks/useAsync";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import {
    extractRelatedAttributesOrdered,
    findVariantByAttributeParams,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";
import {
    getProductBySlug,
    ResponseBody as GetProductBySlugResponseDto,
} from "@/api/products/[slug]/GET";
import styles from "./index.module.css";

export interface IProductContext {
    product: useAsync.InferUseAsyncReturnTypeFromFunction<typeof getProductBySlug>;
    variant: GetProductBySlugResponseDto["variants"][number] | null;
    selectedAttributeParams: Map<string, string>;
    setSelectedAttributeParams: React.Dispatch<React.SetStateAction<Map<string, string>>>;
    relatedAttributes: ReturnType<typeof extractRelatedAttributesOrdered>;

    defaultData: {
        product: RecursivePartial<GetProductBySlugResponseDto>;
        variant: RecursivePartial<GetProductBySlugResponseDto["variants"][number]>;
    };
}

const defaultProductContext: IProductContext = {
    product: createQueryContextObject({ awaiting: true }),
    variant: null,
    selectedAttributeParams: new Map(),
    setSelectedAttributeParams: () => {},
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
    const attributeParams: IProductContext["selectedAttributeParams"] = new Map();
    if (variant) variant.attributes.forEach((a) => attributeParams.set(a.type.code, a.value.code));
    return attributeParams;
};

const generateSearchParamsFromAttributeParams = (
    product: GetProductBySlugResponseDto | null,
    attributeParams: IProductContext["selectedAttributeParams"],
): URLSearchParams => {
    const searchParams = new URLSearchParams();
    [...attributeParams.entries()]
        .sort((a, b) => {
            const [aCode] = a;
            const [bCode] = b;
            const aAttIndex = product?.attributes.find((att) => att.code === aCode)?.position || -1;
            const bAttIndex = product?.attributes.find((att) => att.code === bCode)?.position || -1;
            return aAttIndex - bAttIndex;
        })
        .forEach((entry) => {
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
    >(new Map(searchParams.entries()));
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
    useEffect(() => setProduct(getProductReturn), [getProductReturn]);
    const { response, setParams, attempt } = getProductReturn;

    const productDataRef = useRef<GetProductBySlugResponseDto | null>(
        response.success ? response.data : null,
    );
    useEffect(() => {
        productDataRef.current = response.success ? response.data : null;
    }, [response]);

    useEffect(() => {
        if (product.awaiting) return;

        const newVariant = updateSelectedVariant(productDataRef.current);
        const newSearchParams = generateAttributeParamsFromVariant(newVariant);
        setSelectedAttributeParams(newSearchParams);
    }, [updateSelectedVariant, product]);

    useEffect(() => {
        const newSearchParams = generateSearchParamsFromAttributeParams(
            product.response.success ? product.response.data : null,
            selectedAttributeParams,
        );
        setSearchParams(newSearchParams);
        updateSelectedVariant(productDataRef.current);
    }, [product.response, setSearchParams, selectedAttributeParams, updateSelectedVariant]);

    useMemo(() => {
        if (!productSlug) return;
        setParams([{ params: { path: { slug: productSlug } } }]);
        attempt();
    }, [productSlug, setParams, attempt]);

    const relatedAttributes = useMemo(() => {
        if (!response.success || !variant) return [];
        return extractRelatedAttributesOrdered(response.data, variant);
    }, [response, variant]);

    const productHeroMemo = useMemo(() => <ProductHero />, []);
    const productInformationMemo = useMemo(() => <ProductInformation />, []);
    const recommendedProductsMemo = useMemo(() => <RecommendedProducts />, []);

    const coffeeBlendInfoPanelsMemo = useMemo(() => {
        if (product.awaiting || !product.response.success) return null;
        const { attributes } = product.response.data;
        if (!attributes.find((c) => c.code === "coffee_blend")) return null;
        return <CoffeeBlendInfoPanels />;
    }, [product]);

    return (
        <ProductContext.Provider
            value={useMemo(
                () => ({
                    product,
                    variant,
                    selectedAttributeParams,
                    setSelectedAttributeParams,
                    relatedAttributes,

                    defaultData: defaultProductContext.defaultData,
                }),
                [
                    product,
                    variant,
                    selectedAttributeParams,
                    setSelectedAttributeParams,
                    relatedAttributes,
                ],
            )}
        >
            <div className={styles["page"]}>
                {productHeroMemo}
                {productInformationMemo}
                {coffeeBlendInfoPanelsMemo}
                {recommendedProductsMemo}
            </div>
            {children}
        </ProductContext.Provider>
    );
}
