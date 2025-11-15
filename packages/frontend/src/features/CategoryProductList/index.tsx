import { Fragment, useContext } from "react";
import { RootContext } from "@/pages/Root";
import { CategoryContext } from "@/pages/Category";
import { Divider, useMatches } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ProductCard } from "@/features/ProductCard";
import { GetCategoryBySlugResponseDto, skeletonCategory } from "@/utils/products/categories";
import styles from "./index.module.css";
import { SubcategoryProductList } from "./components/SubcategoryProductList";

export function CategoryProductList() {
    const productsToDisplayWhileAwaiting = useMatches(
        { base: 1, xs: 2, md: 3, lg: 4 },
        { getInitialValueInEffect: false },
    );

    const { categories } = useContext(RootContext);
    const { categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "categories", context: categories },
            { name: "category", context: categoryData },
        ],
    });

    if (!awaitingAny) {
        if (data.categories && data.category) category = data.category;
    }

    return (
        <section className={styles["category-product-list"]}>
            <div className={styles["category-product-list-width-controller"]}>
                {category.products.length > 0 && (
                    <div className={styles["category-product-list-category-group"]}>
                        {category.products
                            .slice(0, awaitingAny ? productsToDisplayWhileAwaiting : -1)
                            .map((product) => (
                                <ProductCard
                                    productData={product}
                                    awaiting={awaitingAny}
                                    key={product.id}
                                />
                            ))}
                    </div>
                )}

                {category.products.length > 0 && category.subcategories.length > 0 && <Divider />}

                {category.subcategories
                    .slice(0, awaitingAny ? 3 : undefined)
                    .map((subcategory, i) => {
                        const { slug } = subcategory;
                        return (
                            <Fragment key={subcategory.slug}>
                                <SubcategoryProductList slug={slug} awaiting={awaitingAny} />
                                {i < category.subcategories.length - 1 && <Divider />}
                            </Fragment>
                        );
                    })}
            </div>
        </section>
    );
}
