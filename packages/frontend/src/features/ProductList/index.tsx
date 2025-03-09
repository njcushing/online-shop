import { useContext, useMemo } from "react";
import { CategoryContext } from "@/pages/Category";
import { Divider } from "@mantine/core";
import { Product } from "./components/Product";
import styles from "./index.module.css";

export function ProductList() {
    const { categoryData } = useContext(CategoryContext);

    const currentCategory = useMemo(() => {
        return categoryData.length > 0 ? categoryData[categoryData.length - 1] : undefined;
    }, [categoryData]);
    if (!currentCategory) return null;

    const { subcategories, products } = currentCategory;

    return (
        <section className={styles["product-list"]}>
            {products && products.length > 0 && (
                <div className={styles["product-list-category-group"]}>
                    {products.map((product) => (
                        <Product productData={product} key={product.id} />
                    ))}
                </div>
            )}
            {subcategories &&
                subcategories.length > 0 &&
                subcategories.map((subcategory, i) => {
                    if (!subcategory.products) return null;
                    if (subcategory.products.length === 0) return null;
                    return (
                        <>
                            <div className={styles["product-list-category-group"]}>
                                <div className={styles["subcategory-information"]}>
                                    <p className={styles["subcategory-name"]}>{subcategory.name}</p>
                                    <p className={styles["subcategory-description"]}>
                                        {subcategory.description}
                                    </p>
                                </div>
                                {subcategory.products.slice(0, 7).map((product) => (
                                    <Product productData={product} key={product.id} />
                                ))}
                            </div>
                            {i < currentCategory.subcategories!.length - 1 && <Divider />}
                        </>
                    );
                })}
        </section>
    );
}
