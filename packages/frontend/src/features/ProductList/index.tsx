import { useContext, useMemo } from "react";
import { CategoryContext } from "@/pages/Category";
import { Product } from "./components/Product";
import styles from "./index.module.css";

export function ProductList() {
    const { categoryData } = useContext(CategoryContext);

    const currentCategory = useMemo(() => {
        return categoryData.length > 0 ? categoryData[categoryData.length - 1] : undefined;
    }, [categoryData]);
    if (!currentCategory) return null;

    return (
        <section className={styles["product-list"]}>
            {currentCategory.products &&
                currentCategory.products.map((product) => (
                    <Product productData={product} key={product.id} />
                ))}
            {currentCategory.subcategories &&
                currentCategory.subcategories.map((subcategory) => {
                    return subcategory.products
                        ? subcategory.products
                              .slice(0, 6)
                              .map((product) => <Product productData={product} key={product.id} />)
                        : null;
                })}
        </section>
    );
}
