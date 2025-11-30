import { Fragment, useContext, useState, useEffect } from "react";
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
import { SubcategoryProductList } from "./components/SubcategoryProductList";
import { CategoryProductsFilters } from "./components/CategoryProductsFilters";
import { CategoryProductsSort } from "./components/CategoryProductsSort";
import styles from "./index.module.css";

const pageSize = 24;

export function CategoryProductList() {
    const productsToDisplayWhileAwaiting = useMatches(
        { base: 0, xs: 1, md: 2, lg: 3 },
        { getInitialValueInEffect: false },
    );
    const subcategoriesToDisplayWhileAwaiting = 3;

    const { categories } = useContext(RootContext);
    const { categoryData, urlPathSplit } = useContext(CategoryContext);

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
        [{ params: { path: { slug: urlPathSplit.at(-1)! }, query: { page: 1, pageSize } } }],
        { attemptOnMount: false }, // useEffect hook will immediately trigger attempt on mount
    );

    if (!productsAwaiting) {
        if (productsResponse.success) products = productsResponse.data;
    }

    const [page] = useState<number>(1);

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
    }, [urlPathSplit, page, productsSetParams, productsAttempt]);

    const awaitingProducts =
        productsAwaiting || productsResponse.status === customStatusCodes.unattempted;

    const awaitingSubcategories =
        categoryData.awaiting || categoryData.response.status === customStatusCodes.unattempted;

    const productCount = awaitingProducts ? productsToDisplayWhileAwaiting : category.productCount;
    const subcategoryCount = awaitingSubcategories
        ? subcategoriesToDisplayWhileAwaiting
        : category.subcategories.length;

    return (
        <section className={styles["category-product-list"]}>
            <div className={styles["category-product-list-width-controller"]}>
                {products.length > 0 && (
                    <div className={styles["category-product-list-category-group-container"]}>
                        <CategoryProductsFilters />

                        <div className={styles["category-product-list-category-group"]}>
                            <CategoryProductsSort />

                            <div
                                className={styles["category-product-list-category-group-products"]}
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
                            <SubcategoryProductList slug={slug} awaiting={awaitingSubcategories} />
                            {i < category.subcategories.length - 1 && <Divider />}
                        </Fragment>
                    );
                })}
            </div>
        </section>
    );
}
