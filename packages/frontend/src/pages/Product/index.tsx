import { ProductHero } from "@/features/ProductHero";
import styles from "./index.module.css";

export function Product() {
    return (
        <div className={styles["page"]}>
            <ProductHero />
        </div>
    );
}
