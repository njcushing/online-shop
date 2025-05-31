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

    const currentCategory = useMemo(() => {
        return categoryData.length > 0 ? categoryData[categoryData.length - 1] : undefined;
    }, [categoryData]);

    const { subcategories, products } = currentCategory || { subcategories: [], products: [] };

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.map((p) => findProductFromId(p)).filter((p) => p);
    }, [products]);

    const filteredSubcategories = useMemo(() => {
        if (!subcategories) return [];
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
                                    style={{
                                        flexShrink: 0,
                                        padding: "8px",
                                        marginLeft: "-8px",
                                        width: "calc(100% + 8px)",
                                    }}
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
