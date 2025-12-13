import {
    Fragment,
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { RootContext } from "@/pages/Root";
import { CategoryContext } from "@/pages/Category";
import { Divider, useMatches } from "@mantine/core";
import * as useAsync from "@/hooks/useAsync";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import {
    ResponseBody as GetCategoryBySlugProductsResponseDto,
    getCategoryBySlugProducts,
} from "@/api/categories/[slug]/products/GET";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import { ProductCard } from "@/features/ProductCard";
import { GetCategoryBySlugResponseDto, skeletonCategory } from "@/utils/products/categories";
import { customStatusCodes } from "@/api/types";
import { mockProducts } from "@/utils/products/product";
import _ from "lodash";
import { isNumeric } from "@/utils/isNumeric";
import { parseSearchParams } from "./utils/parseSearchParams";
import { createSearchParams } from "./utils/createSearchParams";
import { SubcategoryProductList } from "./components/SubcategoryProductList";
import { CategoryProductsFilters } from "./components/CategoryProductsFilters";
import { CategoryProductsSort, sortOptions } from "./components/CategoryProductsSort";
import styles from "./index.module.css";

export const defaultPageSize = 24;

type Filters = Map<
    string,
    | { type: "text"; value: string[] }
    | { type: "numeric"; value: [number, number] }
    | { type: "boolean"; value: boolean }
    | { type: "color"; value: string[] }
    | { type: "date"; value: string[] }
    | { type: "select"; value: string }
>;
type Sort = (typeof sortOptions)[number]["name"] | null;

export interface ICategoryProductListContext {
    products: useAsync.InferUseAsyncReturnTypeFromFunction<typeof getCategoryBySlugProducts>;
    filterSelections: Filters;
    setFilterSelections: React.Dispatch<React.SetStateAction<Filters>>;
    sortSelection: Sort;
    setSortSelection: React.Dispatch<React.SetStateAction<Sort>>;
}

export const defaultCategoryProductListContext: ICategoryProductListContext = {
    products: createQueryContextObject(),
    filterSelections: new Map(),
    setFilterSelections: () => {},
    sortSelection: null,
    setSortSelection: () => {},
};

export const CategoryProductListContext = createContext<ICategoryProductListContext>(
    defaultCategoryProductListContext,
);

export function CategoryProductList() {
    const productsToDisplayWhileAwaiting = useMatches(
        { base: 0, xs: 1, md: 2, lg: 3 },
        { getInitialValueInEffect: false },
    );
    const subcategoriesToDisplayWhileAwaiting = 3;

    const { categories } = useContext(RootContext);
    const { urlPathSplit, categoryBranch, categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [
            { name: "categories", context: categories },
            { name: "category", context: categoryData },
        ],
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const [filterSelections, filterSelectionsSetter] = useState<
        ICategoryProductListContext["filterSelections"]
    >(new Map(parseSearchParams(searchParams, category.filters).filters));
    const [sortSelection, setSortSelection] = useState<
        ICategoryProductListContext["sortSelection"]
    >(parseSearchParams(searchParams, category.filters).sort || null);
    const [page, setPage] = useState<number>(
        parseSearchParams(searchParams, category.filters).page,
    );
    const [pageSize, setPageSize] = useState<number>(
        parseSearchParams(searchParams, category.filters).pageSize,
    );

    let productsData = {
        products: mockProducts,
        price: { min: 0, max: 0 },
    } as GetCategoryBySlugProductsResponseDto;

    if (!contextAwaitingAny) {
        if (data.categories && data.category) category = data.category;
    }

    const products = useAsync.GET(
        getCategoryBySlugProducts,
        [
            {
                params: {
                    path: { slug: urlPathSplit.at(-1)! },
                    query: {
                        filter: searchParams.get("filter") ?? undefined,
                        sort: searchParams.get("sort") ?? undefined,
                        page:
                            searchParams.has("page") && isNumeric(searchParams.get("page")!)
                                ? Number(searchParams.get("page"))
                                : 1,
                        pageSize:
                            searchParams.has("pageSize") && isNumeric(searchParams.get("pageSize")!)
                                ? Number(searchParams.get("pageSize"))
                                : undefined,
                    },
                },
            },
        ] as Parameters<typeof getCategoryBySlugProducts>,
        { attemptOnMount: false }, // useEffect hook should not immediately trigger attempt on mount
    );
    const {
        response: productsResponse,
        setParams: productsSetParams,
        attempt: productsAttempt,
        awaiting: productsAwaiting,
    } = products;

    if (!productsAwaiting) {
        if (productsResponse.success) productsData = productsResponse.data;
    }

    /**
     * Custom setter to avoid unnecessary rerenders when filterSelections is set to a new Map
     * instance even though it has identical key-value pairs, as a change in the Map's reference
     * triggers the useEffect hook.
     */
    const setFilterSelections = useCallback(
        (newValue: Filters | ((curr: Filters) => Filters), preventRerender: boolean = false) => {
            filterSelectionsSetter((curr) => {
                let newFilterSelections = newValue;
                if (typeof newValue === "function") newFilterSelections = newValue(curr);
                // Preserve object reference to prevent rerender if specified
                if (preventRerender) {
                    curr.keys().forEach((k) => curr.delete(k));
                    (newFilterSelections as Filters).entries().forEach((e) => curr.set(e[0], e[1]));
                }
                if (!_.isEqual(curr, newFilterSelections)) return newFilterSelections as Filters;
                return curr;
            });
        },
        [],
    );

    useEffect(() => {
        productsSetParams([
            {
                params: {
                    path: { slug: urlPathSplit.at(-1)! },
                    query: {
                        filter: searchParams.get("filter") ?? undefined,
                        sort: searchParams.get("sort") ?? undefined,
                        page:
                            searchParams.has("page") && isNumeric(searchParams.get("page")!)
                                ? Number(searchParams.get("page"))
                                : 1,
                        pageSize:
                            searchParams.has("pageSize") && isNumeric(searchParams.get("pageSize")!)
                                ? Number(searchParams.get("pageSize"))
                                : undefined,
                    },
                },
            },
        ]);
        productsAttempt();
    }, [urlPathSplit, productsSetParams, productsAttempt, searchParams]);

    useEffect(() => {
        const newSearchParams = createSearchParams({
            filters: filterSelections,
            sort: sortSelection,
            page,
            pageSize,
        });
        setSearchParams(newSearchParams);
    }, [setSearchParams, filterSelections, sortSelection, page, pageSize]);

    // Clear search params when navigating to other categories
    const cachedCategoryName = useRef<string>(urlPathSplit.at(-1)!);
    useEffect(() => {
        if (cachedCategoryName.current !== urlPathSplit.at(-1)!) {
            setFilterSelections(new Map());
            setSortSelection(null);
            setPage(1);
            setPageSize(defaultPageSize);
            setSearchParams(new URLSearchParams());
            cachedCategoryName.current = urlPathSplit.at(-1)!;
        }
    }, [urlPathSplit, setFilterSelections, setSearchParams]);

    const displaySidebar = useMemo(() => {
        const currentCategory = categoryBranch.find((l) => l.slug === urlPathSplit.at(-1));
        if (!currentCategory) return false;
        if (currentCategory.subcategories.length > 0) return false;
        return true;
    }, [urlPathSplit, categoryBranch]);

    const awaitingCategory =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;

    const awaitingProducts =
        productsAwaiting || productsResponse.status === customStatusCodes.unattempted;

    const awaitingSubcategories =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;

    const productCount = awaitingProducts
        ? productsToDisplayWhileAwaiting + (displaySidebar ? 0 : 1)
        : category.productCount;
    const subcategoryCount = awaitingSubcategories
        ? subcategoriesToDisplayWhileAwaiting
        : category.subcategories.length;

    useEffect(() => {
        if (awaitingCategory) return;
        setFilterSelections((curr) => {
            const allFilterNames = new Set<string>([
                ...category.filters.map((filter) => filter.name),
            ]);
            const newSelections = new Map(curr);
            newSelections.keys().forEach((key) => {
                if (!allFilterNames.has(key) && key !== "Rating") newSelections.delete(key);
            });
            return newSelections;
        }, true);
    }, [category.filters, awaitingCategory, setFilterSelections]);

    const categoryProductsFilters = useMemo(() => {
        if (!displaySidebar) return null;
        return (
            <CategoryProductsFilters
                filters={category.filters}
                awaiting={awaitingCategory || awaitingProducts}
            />
        );
    }, [category.filters, displaySidebar, awaitingCategory, awaitingProducts]);

    const categoryProductsSort = useMemo(() => {
        if (!displaySidebar) return null;
        return <CategoryProductsSort awaiting={awaitingCategory || awaitingProducts} />;
    }, [awaitingCategory, displaySidebar, awaitingProducts]);

    const productCards = useMemo(() => {
        return productsData.products
            .slice(0, productCount)
            .map((product) => (
                <ProductCard productData={product} awaiting={awaitingProducts} key={product.id} />
            ));
    }, [productsData.products, awaitingProducts, productCount]);

    const categoryGroup = useMemo(() => {
        return productsData.products.length > 0 ? (
            <div
                className={styles["category-product-list-category-group-container"]}
                data-sidebar={!!displaySidebar}
            >
                {categoryProductsFilters}

                <div className={styles["category-product-list-category-group"]}>
                    {categoryProductsSort}

                    <div className={styles["category-product-list-category-group-products"]}>
                        {productCards}
                    </div>
                </div>
            </div>
        ) : null;
    }, [
        productsData.products,
        displaySidebar,
        categoryProductsFilters,
        categoryProductsSort,
        productCards,
    ]);

    const subcategoryProductLists = useMemo(() => {
        return category.subcategories.slice(0, subcategoryCount).map((subcategory, i) => {
            const { slug } = subcategory;
            return (
                <Fragment key={subcategory.slug}>
                    <SubcategoryProductList slug={slug} awaiting={awaitingSubcategories} />
                    {i < category.subcategories.length - 1 && <Divider />}
                </Fragment>
            );
        });
    }, [category.subcategories, awaitingSubcategories, subcategoryCount]);

    return (
        <CategoryProductListContext.Provider
            value={useMemo(
                () => ({
                    products,
                    filterSelections,
                    setFilterSelections,
                    sortSelection,
                    setSortSelection,
                }),
                [products, filterSelections, setFilterSelections, sortSelection, setSortSelection],
            )}
        >
            <section className={styles["category-product-list"]}>
                <div className={styles["category-product-list-width-controller"]}>
                    {categoryGroup}

                    {productsData.products.length > 0 && category.subcategories.length > 0 && (
                        <Divider />
                    )}

                    {subcategoryProductLists}
                </div>
            </section>
        </CategoryProductListContext.Provider>
    );
}
