import { useContext, useMemo } from "react";
import { CategoryContext } from "@/pages/Category";
import { Item } from "./components/Item";
import styles from "./index.module.css";

export function ItemList() {
    const { categoryData } = useContext(CategoryContext);

    const currentCategory = useMemo(() => {
        return categoryData.length > 0 ? categoryData[categoryData.length - 1] : undefined;
    }, [categoryData]);
    if (!currentCategory) return null;

    return (
        <section className={styles["item-list"]}>
            {currentCategory.products &&
                currentCategory.products.map((product) => (
                    <Item itemData={product} key={product.id} />
                ))}
        </section>
    );
}
