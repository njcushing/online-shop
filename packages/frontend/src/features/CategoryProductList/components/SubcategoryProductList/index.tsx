import { useEffect } from "react";
import { useMatches, NavLink, Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import { getCategoryBySlug } from "@/api/categories/[slug]/GET";
import { CaretRight } from "@phosphor-icons/react";
import { ProductCard } from "@/features/ProductCard";
import { GetCategoryBySlugResponseDto, skeletonCategory } from "@/utils/products/categories";
import {
    ResponseBody as GetCategoryBySlugProductsResponseDto,
    getCategoryBySlugProducts,
} from "@/api/categories/[slug]/products/GET";
import { customStatusCodes } from "@/api/types";
import { mockProducts } from "@/utils/products/product";
import styles from "./index.module.css";

export type TSubcategoryProductList = {
    slug: string;
    awaiting?: boolean;
};

export function SubcategoryProductList({ slug, awaiting = false }: TSubcategoryProductList) {
    const productsToDisplay = useMatches(
        { base: 3, xs: 5, lg: 7 },
        { getInitialValueInEffect: false },
    );
    const productsToDisplayWhileAwaiting = useMatches(
        { base: 0, xs: 1, md: 2, lg: 3 },
        { getInitialValueInEffect: false },
    );

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const {
        response: categoryResponse,
        setParams: categorySetParams,
        attempt: categoryAttempt,
        awaiting: categoryAwaiting,
    } = useAsync.GET(
        getCategoryBySlug,
        [{ params: { path: { slug } } }] as Parameters<typeof getCategoryBySlug>,
        { attemptOnMount: false }, // useEffect hook will handle attempt(s)
    );

    if (!categoryAwaiting) {
        if (categoryResponse.success) category = categoryResponse.data;
    }

    useEffect(() => {
        if (awaiting) return;

        categorySetParams([{ params: { path: { slug } } }]);
        categoryAttempt();
    }, [slug, awaiting, categorySetParams, categoryAttempt]);

    const awaitingCategory =
        awaiting || categoryAwaiting || categoryResponse.status === customStatusCodes.unattempted;

    let productsData = {
        products: mockProducts,
        price: { min: 0, max: 0 },
    } as GetCategoryBySlugProductsResponseDto;

    const {
        response: productsResponse,
        setParams: productsSetParams,
        attempt: productsAttempt,
        awaiting: productsAwaiting,
    } = useAsync.GET(
        getCategoryBySlugProducts,
        [{}],
        { attemptOnMount: false }, // useEffect hook will handle attempt(s)
    );

    if (!awaiting) {
        if (productsResponse.success) productsData = productsResponse.data;
    }

    useEffect(() => {
        if (awaiting) return;

        productsSetParams([
            {
                params: {
                    path: { slug },
                    query: { page: 1, pageSize: 7 },
                },
            },
        ]);
        productsAttempt();
    }, [slug, awaiting, productsSetParams, productsAttempt]);

    const awaitingProducts =
        awaiting || productsAwaiting || productsResponse.status === customStatusCodes.unattempted;

    const awaitingAny = awaitingCategory || awaitingProducts;

    let productCount = productsToDisplay;
    if (awaitingAny) productCount = productsToDisplayWhileAwaiting;
    if (!awaitingAny && categoryResponse.success) productCount = category.productCount;

    return (
        <div className={styles["product-list-category-group"]}>
            <div className={styles["subcategory-information"]}>
                <Skeleton visible={awaitingCategory}>
                    <h2
                        className={styles["subcategory-name"]}
                        style={{ visibility: awaitingCategory ? "hidden" : "initial" }}
                    >
                        {category.name}
                    </h2>
                </Skeleton>

                <Skeleton visible={awaitingCategory}>
                    <p
                        className={styles["subcategory-description"]}
                        style={{ visibility: awaitingCategory ? "hidden" : "initial" }}
                    >
                        {category.description}
                    </p>
                </Skeleton>

                <Skeleton visible={awaitingCategory}>
                    <NavLink
                        component={Link}
                        to={category.slug}
                        label="Shop all"
                        rightSection={<CaretRight size={16} />}
                        className={styles["shop-all-button"]}
                        style={{ visibility: awaitingCategory ? "hidden" : "initial" }}
                    />
                </Skeleton>
            </div>

            {productsData.products.slice(0, productCount).map((product) => (
                <ProductCard productData={product!} awaiting={awaitingAny} key={product!.id} />
            ))}
        </div>
    );
}
