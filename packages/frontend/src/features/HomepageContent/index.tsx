import { Hero } from "./components/Hero";
import { CoffeeBlendInfoPanels } from "../CoffeeBlendInfoPanels";
import { CategoryCards } from "./components/CategoryCards";
import styles from "./index.module.css";

export function HomepageContent() {
    return (
        <div className={styles["homepage-content"]}>
            <Hero />
            <CoffeeBlendInfoPanels />
            <CategoryCards />
        </div>
    );
}
