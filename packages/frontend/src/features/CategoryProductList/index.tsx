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
    const narrow = useMatches({ base: true, xs: false }, { getInitialValueInEffect: false });

    const { categories } = useContext(RootContext);
    const { urlPathSplit, categoryBranch, categoryData } = useContext(CategoryContext);

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [
            { name: "categories", context: categories },
            { name: "category", context: categoryData },
        ],
    });

    const category = useMemo(() => {
        if (!contextAwaitingAny && data.categories && data.category) return data.category;
        return skeletonCategory as GetCategoryBySlugResponseDto;
    }, [data.categories, data.category, contextAwaitingAny]);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchParamsRef = useRef<URLSearchParams>(searchParams);
    useEffect(() => {
        searchParamsRef.current = searchParams;
    }, [searchParams]);

    const [filterSelections, filterSelectionsSetter] = useState<
        ICategoryProductListContext["filterSelections"]
    >(new Map());
    const [sortSelection, setSortSelection] =
        useState<ICategoryProductListContext["sortSelection"]>(null);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);

    const products = useAsync.GET(
        getCategoryBySlugProducts,
        [
            {
                params: {
                    path: { slug: urlPathSplit.at(-1)! },
                    query: {
                        filter: searchParamsRef.current.get("filter") ?? undefined,
                        sort: searchParamsRef.current.get("sort") ?? undefined,
                        page:
                            searchParamsRef.current.has("page") &&
                            isNumeric(searchParamsRef.current.get("page")!)
                                ? Number(searchParamsRef.current.get("page"))
                                : 1,
                        pageSize:
                            searchParamsRef.current.has("pageSize") &&
                            isNumeric(searchParamsRef.current.get("pageSize")!)
                                ? Number(searchParamsRef.current.get("pageSize"))
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

    const productsData = useMemo(() => {
        if (!productsAwaiting && productsResponse.success) return productsResponse.data;
        return {
            products: mockProducts,
            price: { min: 0, max: 0 },
        } as GetCategoryBySlugProductsResponseDto;
    }, [productsResponse, productsAwaiting]);

    const getProducts = useCallback(
        (params: URLSearchParams) => {
            productsSetParams([
                {
                    params: {
                        path: { slug: urlPathSplit.at(-1)! },
                        query: {
                            filter: params.get("filter") ?? undefined,
                            sort: params.get("sort") ?? undefined,
                            page:
                                params.has("page") && isNumeric(params.get("page")!)
                                    ? Number(params.get("page"))
                                    : 1,
                            pageSize:
                                params.has("pageSize") && isNumeric(params.get("pageSize")!)
                                    ? Number(params.get("pageSize"))
                                    : undefined,
                        },
                    },
                },
            ]);
            productsAttempt();
        },
        [urlPathSplit, productsSetParams, productsAttempt],
    );

    /**
     * Custom setter to avoid unnecessary rerenders when filterSelections is set to a new Map
     * instance even though it has identical key-value pairs, and to control when new queries are
     * sent to the server
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

    const awaitingCategory =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;
    const awaitingCategoryRef = useRef<boolean>(awaitingCategory);
    useEffect(() => {
        awaitingCategoryRef.current = awaitingCategory;
    }, [awaitingCategory]);

    /**
     * Parse URL search params when category is successfully fetched to remove invalid params from
     * URL and update URL search params accordingly
     */
    useEffect(() => {
        if (awaitingCategory) return;

        const { current } = searchParamsRef;

        const parsedSearchParams = parseSearchParams(current, category.filters);

        setFilterSelections(parsedSearchParams.filters);
        setSortSelection(parsedSearchParams.sort);
        setPage(parsedSearchParams.page);
        setPageSize(parsedSearchParams.pageSize);

        const newSearchParams = createSearchParams(parsedSearchParams);
        setSearchParams(newSearchParams);
    }, [category.filters, setSearchParams, setFilterSelections, getProducts, awaitingCategory]);

    const cachedCategoryName = useRef<string>(urlPathSplit.at(-1)!);
    const cachedProductsStatus = useRef<number>(products.response.status);

    useEffect(() => {
        if (awaitingCategory) return;

        const newParams = createSearchParams({
            filters: filterSelections,
            sort: sortSelection,
            page,
            pageSize,
        });

        const hasChanged = newParams.toString() !== searchParams.toString();

        if (newParams.get("filter")) searchParams.set("filter", newParams.get("filter")!);
        else if (searchParams.has("filter")) searchParams.delete("filter");

        if (newParams.get("sort")) searchParams.set("sort", newParams.get("sort")!);
        else if (searchParams.has("sort")) searchParams.delete("sort");

        if (newParams.get("page")) searchParams.set("page", newParams.get("page")!);
        else if (searchParams.has("page")) searchParams.delete("page");

        if (newParams.get("pageSize")) searchParams.set("pageSize", newParams.get("pageSize")!);
        else if (searchParams.has("pageSize")) searchParams.delete("pageSize");

        window.history.pushState(
            {},
            "",
            searchParams.size > 0 ? `?${searchParams.toString()}` : window.location.pathname,
        );

        if (
            hasChanged ||
            cachedProductsStatus.current === customStatusCodes.unattempted ||
            cachedCategoryName.current !== urlPathSplit.at(-1)!
        ) {
            getProducts(newParams);
        }
    }, [
        searchParams,
        filterSelections,
        sortSelection,
        page,
        pageSize,
        getProducts,
        awaitingCategory,
        urlPathSplit,
    ]);

    useEffect(() => {
        cachedProductsStatus.current = products.response.status;
    }, [products.response.status]);

    const clearSearchParams = useCallback(() => {
        setFilterSelections(new Map());
        setSortSelection(null);
        setPage(1);
        setPageSize(defaultPageSize);
        setSearchParams(new URLSearchParams());
    }, [setFilterSelections, setSearchParams]);

    // Clear search params when navigating to other categories
    useEffect(() => {
        if (cachedCategoryName.current !== urlPathSplit.at(-1)!) {
            clearSearchParams();
            cachedCategoryName.current = urlPathSplit.at(-1)!;
        }
    }, [urlPathSplit, clearSearchParams]);

    const layoutType = useMemo<"single" | "multi">(() => {
        const currentCategory = categoryBranch.find((l) => l.slug === urlPathSplit.at(-1));
        if (!currentCategory) return "multi";
        if (currentCategory.subcategories.length > 0) return "multi";
        return "single";
    }, [urlPathSplit, categoryBranch]);

    const awaitingProducts =
        productsAwaiting || productsResponse.status === customStatusCodes.unattempted;

    const awaitingSubcategories =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;

    const productCount = awaitingProducts
        ? productsToDisplayWhileAwaiting + (layoutType === "single" ? 0 : 1)
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
                if (
                    !allFilterNames.has(key) &&
                    key.toLowerCase() !== "rating" &&
                    key.toLowerCase() !== "price"
                ) {
                    newSelections.delete(key);
                }
            });
            return newSelections;
        }, true);
    }, [category.filters, awaitingCategory, setFilterSelections]);

    const categoryProductsFilters = useMemo(() => {
        if (layoutType !== "single") return null;
        return (
            <CategoryProductsFilters
                layout={narrow ? "dropdown" : "visible"}
                filters={category.filters}
                awaiting={awaitingCategory || awaitingProducts}
            />
        );
    }, [narrow, category.filters, layoutType, awaitingCategory, awaitingProducts]);

    const categoryProductsSort = useMemo(() => {
        if (layoutType !== "single") return null;
        return <CategoryProductsSort awaiting={awaitingCategory || awaitingProducts} />;
    }, [awaitingCategory, layoutType, awaitingProducts]);

    const productCards = useMemo(() => {
        return productsData.products
            .slice(0, productCount)
            .map((product) => (
                <ProductCard productData={product} awaiting={awaitingProducts} key={product.id} />
            ));
    }, [productsData.products, awaitingProducts, productCount]);

    const categoryGroup = useMemo(() => {
        if (layoutType === "multi" && productsData.products.length === 0) return null;
        return (
            <div
                className={styles["category-product-list-category-group-container"]}
                data-layout={narrow ? "narrow" : "wide"}
                data-sidebar={layoutType === "single"}
            >
                {narrow ? (
                    <>
                        <div
                            className={styles["category-product-list-category-group"]}
                            data-layout="narrow"
                        >
                            {categoryProductsFilters}

                            {categoryProductsSort}
                        </div>

                        <div className={styles["category-product-list-category-group-products"]}>
                            {productCards}
                        </div>
                    </>
                ) : (
                    <>
                        {categoryProductsFilters}

                        <div
                            className={styles["category-product-list-category-group"]}
                            data-layout="wide"
                        >
                            {categoryProductsSort}

                            <div
                                className={styles["category-product-list-category-group-products"]}
                            >
                                {productCards}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }, [
        narrow,
        productsData.products.length,
        layoutType,
        categoryProductsFilters,
        categoryProductsSort,
        productCards,
    ]);

    const subcategoryProductLists = useMemo(() => {
        if (layoutType !== "multi") return null;
        return category.subcategories.slice(0, subcategoryCount).map((subcategory, i) => {
            const { slug } = subcategory;
            return (
                <Fragment key={subcategory.slug}>
                    <SubcategoryProductList slug={slug} awaiting={awaitingSubcategories} />
                    {i < category.subcategories.length - 1 && <Divider />}
                </Fragment>
            );
        });
    }, [category.subcategories, layoutType, awaitingSubcategories, subcategoryCount]);

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

                    {categoryGroup && subcategoryProductLists && <Divider />}

                    {subcategoryProductLists}
                </div>
            </section>
        </CategoryProductListContext.Provider>
    );
}
