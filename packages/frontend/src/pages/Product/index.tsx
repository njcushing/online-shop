import { createContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import { RecommendedProducts } from "@/features/RecommendedProducts";
import * as useAsync from "@/hooks/useAsync";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import {
    Product as ProductDataType,
    ProductVariant,
    findVariantFromOptions,
    filterVariantOptions,
    findCollections,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { mockGetProduct } from "@/api/mocks";
import { RecursivePartial } from "@/utils/types";
import styles from "./index.module.css";

const defaultVariantOptionsData: ReturnType<typeof filterVariantOptions> = new Map([
    ["option", new Set(["1", "2", "3"])],
]);

const defaultCollectionStepsData: ReturnType<typeof findCollections> = [
    {
        collection: { id: "", type: "quantity" },
        products: Array.from({ length: 3 }).map((v, i) => {
            return {
                id: "",
                name: {
                    full: "Product Name",
                    shorthands: [{ type: "quantity", value: `Shorthand ${i}` }],
                },
                description: "",
                slug: "",
                images: { thumb: { src: "", alt: "" }, dynamic: [] },
                rating: {
                    meanValue: 0.0,
                    totalQuantity: 0,
                    quantities: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
                },
                allowance: 0,
                tags: [],
                variants: [],
                variantOptionOrder: [],
                customisations: [],
                reviews: [],
                releaseDate: "",
            };
        }),
    },
];

export interface IProductContext {
    product: useAsync.InferUseAsyncReturnTypeFromFunction<typeof mockGetProduct>;
    variant: ProductVariant | null;
    selectedVariantOptions: ProductVariant["options"];
    setSelectedVariantOptions: React.Dispatch<React.SetStateAction<ProductVariant["options"]>>;

    defaultData: {
        product: RecursivePartial<ProductDataType>;
        variant: RecursivePartial<ProductVariant>;
        variantOptions: ReturnType<typeof filterVariantOptions>;
        collectionSteps: ReturnType<typeof findCollections>;
    };
}

const defaultProductContext: IProductContext = {
    product: createQueryContextObject(),
    variant: null,
    selectedVariantOptions: {},
    setSelectedVariantOptions: () => {},

    defaultData: {
        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
        variantOptions: defaultVariantOptionsData,
        collectionSteps: defaultCollectionStepsData,
    },
};

export const ProductContext = createContext<IProductContext>(defaultProductContext);

export type TProduct = {
    children?: React.ReactNode;
};

export function Product({ children }: TProduct) {
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { productId } = params;

    const [product, setProduct] = useState<IProductContext["product"]>(
        defaultProductContext.product,
    );
    const getProductReturn = useAsync.GET(mockGetProduct, [{ params: { productId } }], {
        attemptOnMount: true,
    });
    useEffect(() => setProduct(getProductReturn), [getProductReturn]);
    const { response, setParams, attempt } = getProductReturn;

    const productDataRef = useRef<ProductDataType | null>(response.data);
    useEffect(() => {
        productDataRef.current = response.data;
    }, [response]);

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

    useMemo(() => {
        setParams([{ params: { productId } }]);
        attempt();
    }, [setParams, attempt, productId]);

    useEffect(() => {
        updateSelectedVariantData(response?.data || null);
    }, [response, updateSelectedVariantData]);

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

                    defaultData: defaultProductContext.defaultData,
                }),
                [product, variant, selectedVariantOptions, setSelectedVariantOptions],
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
