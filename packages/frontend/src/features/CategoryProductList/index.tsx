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
import { ProductCard } from "@/features/ProductCard";
import { GetCategoryBySlugResponseDto, skeletonCategory } from "@/utils/products/categories";
import { customStatusCodes } from "@/api/types";
import { mockProducts } from "@/utils/products/product";
import _ from "lodash";
import { parseSearchParams } from "./utils/parseSearchParams";
import { createSearchParams } from "./utils/createSearchParams";
import { SubcategoryProductList } from "./components/SubcategoryProductList";
import { CategoryProductsFilters } from "./components/CategoryProductsFilters";
import { CategoryProductsSort, sortOptions } from "./components/CategoryProductsSort";
import styles from "./index.module.css";

export const defaultPageSize = 24;

type Filters = Map<string, string | string[]>;
type Sort = (typeof sortOptions)[number]["name"] | null;

export interface ICategoryProductListContext {
    filterSelections: Filters;
    setFilterSelections: React.Dispatch<React.SetStateAction<Filters>>;
    sortSelection: Sort;
    setSortSelection: React.Dispatch<React.SetStateAction<Sort>>;
}

export const defaultCategoryProductListContext: ICategoryProductListContext = {
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
    const { urlPathSplit, categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [
            { name: "categories", context: categories },
            { name: "category", context: categoryData },
        ],
    });

    let products = mockProducts as GetCategoryBySlugProductsResponseDto;

    if (!contextAwaitingAny) {
        if (data.categories && data.category) category = data.category;
    }

    const {
        response: productsResponse,
        setParams: productsSetParams,
        attempt: productsAttempt,
        awaiting: productsAwaiting,
    } = useAsync.GET(
        getCategoryBySlugProducts,
        [
            {
                params: {
                    path: { slug: urlPathSplit.at(-1)! },
                    query: { page: 1, pageSize: defaultPageSize },
                },
            },
        ],
        { attemptOnMount: false }, // useEffect hook will immediately trigger attempt on mount
    );

    if (!productsAwaiting) {
        if (productsResponse.success) products = productsResponse.data;
    }

    const [searchParams, setSearchParams] = useSearchParams();

    const [filterSelections, filterSelectionsSetter] = useState<
        ICategoryProductListContext["filterSelections"]
    >(new Map(parseSearchParams(searchParams).filters));
    const [sortSelection, setSortSelection] = useState<
        ICategoryProductListContext["sortSelection"]
    >(parseSearchParams(searchParams).sort || null);
    const [page, setPage] = useState<number>(parseSearchParams(searchParams).page);
    const [pageSize, setPageSize] = useState<number>(parseSearchParams(searchParams).pageSize);

    /**
     * Custom setter to avoid unnecessary rerenders when filterSelections is set to a new Map
     * instance even though it has identical key-value pairs, as a change in the Map's reference
     * triggers the useEffect hook.
     */
    const setFilterSelections = useCallback((newValue: Filters | ((curr: Filters) => Filters)) => {
        filterSelectionsSetter((curr) => {
            let newFilterSelections = newValue;
            if (typeof newValue === "function") newFilterSelections = newValue(curr);
            if (!_.isEqual(curr, newFilterSelections)) return newFilterSelections as Filters;
            return curr;
        });
    }, []);

    useEffect(() => {
        productsSetParams([
            {
                params: {
                    path: { slug: urlPathSplit.at(-1)! },
                    query: { page, pageSize },
                },
            },
        ]);
        productsAttempt();
    }, [
        urlPathSplit,
        productsSetParams,
        productsAttempt,
        filterSelections,
        sortSelection,
        page,
        pageSize,
    ]);

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

    const awaitingCategory =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;

    const awaitingProducts =
        productsAwaiting || productsResponse.status === customStatusCodes.unattempted;

    const awaitingSubcategories =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;

    const productCount = awaitingProducts ? productsToDisplayWhileAwaiting : category.productCount;
    const subcategoryCount = awaitingSubcategories
        ? subcategoriesToDisplayWhileAwaiting
        : category.subcategories.length;

    useEffect(() => {
        if (awaitingCategory || awaitingProducts) return;
        setFilterSelections((curr) => {
            const allFilterNames = new Set<string>([
                ...category.filters.map((filter) => filter.name),
            ]);
            const newSelections = new Map(curr);
            newSelections.keys().forEach((key) => {
                if (!allFilterNames.has(key) && key !== "Rating") newSelections.delete(key);
            });
            return newSelections;
        });
    }, [category.filters, awaitingCategory, awaitingProducts, setFilterSelections]);

    return (
        <CategoryProductListContext.Provider
            value={useMemo(
                () => ({
                    filterSelections,
                    setFilterSelections,
                    sortSelection,
                    setSortSelection,
                }),
                [filterSelections, setFilterSelections, sortSelection, setSortSelection],
            )}
        >
            <section className={styles["category-product-list"]}>
                <div className={styles["category-product-list-width-controller"]}>
                    {products.length > 0 && (
                        <div className={styles["category-product-list-category-group-container"]}>
                            <CategoryProductsFilters
                                filters={category.filters}
                                awaiting={awaitingCategory || awaitingProducts}
                            />

                            <div className={styles["category-product-list-category-group"]}>
                                <CategoryProductsSort
                                    awaiting={awaitingCategory || awaitingProducts}
                                />

                                <div
                                    className={
                                        styles["category-product-list-category-group-products"]
                                    }
                                >
                                    {products.slice(0, productCount).map((product) => (
                                        <ProductCard
                                            productData={product}
                                            awaiting={awaitingProducts}
                                            key={product.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {products.length > 0 && category.subcategories.length > 0 && <Divider />}

                    {category.subcategories.slice(0, subcategoryCount).map((subcategory, i) => {
                        const { slug } = subcategory;
                        return (
                            <Fragment key={subcategory.slug}>
                                <SubcategoryProductList
                                    slug={slug}
                                    awaiting={awaitingSubcategories}
                                />
                                {i < category.subcategories.length - 1 && <Divider />}
                            </Fragment>
                        );
                    })}
                </div>
            </section>
        </CategoryProductListContext.Provider>
    );
}
