import { Hero } from "./components/Hero";
import { CoffeeBlendInfoPanels } from "../CoffeeBlendInfoPanels";
import { CategoryProducts } from "./components/CategoryProducts";
import styles from "./index.module.css";

export function HomepageContent() {
    return (
        <div className={styles["homepage-content"]}>
            <Hero />
            <CoffeeBlendInfoPanels />
            <CategoryProducts />
        </div>
    );
}
