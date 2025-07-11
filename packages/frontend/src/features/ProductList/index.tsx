import { Fragment, useContext, useMemo } from "react";
import { CategoryContext } from "@/pages/Category";
import { useMatches, Divider, NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import { findProductFromId } from "@/utils/products/product";
import { ProductCard } from "@/features/ProductCard";
import styles from "./index.module.css";

export function ProductList() {
    const productsToDisplay = useMatches({ base: 3, xs: 5, lg: 7 });

    const { categoryData } = useContext(CategoryContext);

    const currentCategory = useMemo(() => categoryData.at(-1), [categoryData]);

    const products = useMemo(() => currentCategory?.products || [], [currentCategory]);
    const subcategories = useMemo(() => currentCategory?.subcategories || [], [currentCategory]);

    const filteredProducts = useMemo(() => {
        return products.map((p) => findProductFromId(p)).filter((p) => p);
    }, [products]);

    const filteredSubcategories = useMemo(() => {
        return subcategories.flatMap((subCategory) => {
            if (!subCategory.products) return [];
            const filteredSubcategoryProducts = subCategory.products
                .map((p) => findProductFromId(p))
                .filter((p) => p);
            return filteredSubcategoryProducts.length > 0
                ? { ...subCategory, products: filteredSubcategoryProducts }
                : [];
        });
    }, [subcategories]);

    return (
        <section className={styles["product-list"]}>
            {filteredProducts.length > 0 && (
                <div className={styles["product-list-category-group"]}>
                    {filteredProducts.map((product) => (
                        <ProductCard productData={product!} key={product!.id} />
                    ))}
                </div>
            )}
            {filteredSubcategories.map((subcategory, i) => {
                const { products: subcategoryProducts } = subcategory;
                return (
                    <Fragment key={subcategory.name}>
                        <div className={styles["product-list-category-group"]}>
                            <div className={styles["subcategory-information"]}>
                                <h2 className={styles["subcategory-name"]}>{subcategory.name}</h2>
                                <p className={styles["subcategory-description"]}>
                                    {subcategory.description}
                                </p>
                                <NavLink
                                    component={Link}
                                    to={subcategory.slug}
                                    label="Shop all"
                                    rightSection={<CaretRight size={16} />}
                                    className={styles["shop-all-button"]}
                                />
                            </div>
                            {subcategoryProducts.slice(0, productsToDisplay).map((product) => (
                                <ProductCard productData={product!} key={product!.id} />
                            ))}
                        </div>
                        {i < filteredSubcategories.length - 1 && <Divider />}
                    </Fragment>
                );
            })}
        </section>
    );
}
