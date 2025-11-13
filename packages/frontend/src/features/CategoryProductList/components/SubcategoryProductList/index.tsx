import { useState, useEffect } from "react";
import { useMatches, NavLink, Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import * as useAsync from "@/hooks/useAsync";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { getCategoryBySlug } from "@/api/categories/[slug]/GET";
import { CaretRight } from "@phosphor-icons/react";
import { ProductCard } from "@/features/ProductCard";
import { GetCategoryBySlugResponseDto, skeletonCategory } from "@/utils/products/categories";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import { customStatusCodes } from "@/api/types";
import styles from "./index.module.css";

export type TSubcategoryProductList = {
    slug: string;
    awaiting?: boolean;
};

export function SubcategoryProductList({ slug, awaiting = false }: TSubcategoryProductList) {
    const productsToDisplay = useMatches({ base: 3, xs: 5, lg: 7 });
    const productsToDisplayWhileAwaiting = useMatches(
        { base: 0, xs: 1, md: 2, lg: 3 },
        { getInitialValueInEffect: false },
    );

    const [categoryData, setCategoryData] = useState<
        useAsync.InferUseAsyncReturnTypeFromFunction<typeof getCategoryBySlug>
    >(createQueryContextObject());
    const getCategoryReturn = useAsync.GET(
        getCategoryBySlug,
        [{ params: { path: { slug } } }] as Parameters<typeof getCategoryBySlug>,
        { attemptOnMount: !awaiting },
    );
    useEffect(() => setCategoryData(getCategoryReturn), [getCategoryReturn]);
    const { setParams, attempt } = getCategoryReturn;
    useEffect(() => {
        if (awaiting) return;
        if (slug.length > 0) {
            setParams([{ params: { path: { slug } } }]);
            attempt();
        }
    }, [slug, awaiting, setParams, attempt]);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "category", context: categoryData }],
    });

    if (!contextAwaitingAny) {
        if (data.category) category = data.category;
    }

    const awaitingAny =
        awaiting ||
        contextAwaitingAny ||
        getCategoryReturn.response.status === customStatusCodes.unattempted;

    return (
        <div className={styles["product-list-category-group"]}>
            <div className={styles["subcategory-information"]}>
                <Skeleton visible={awaitingAny}>
                    <h2
                        className={styles["subcategory-name"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        {category.name}
                    </h2>
                </Skeleton>

                <Skeleton visible={awaitingAny}>
                    <p
                        className={styles["subcategory-description"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        {category.description}
                    </p>
                </Skeleton>

                <Skeleton visible={awaitingAny}>
                    <NavLink
                        component={Link}
                        to={category.slug}
                        label="Shop all"
                        rightSection={<CaretRight size={16} />}
                        className={styles["shop-all-button"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    />
                </Skeleton>
            </div>

            {category.products
                .slice(0, awaitingAny ? productsToDisplayWhileAwaiting : productsToDisplay)
                .map((product) => (
                    <ProductCard productData={product!} awaiting={awaitingAny} key={product!.id} />
                ))}
        </div>
    );
}
