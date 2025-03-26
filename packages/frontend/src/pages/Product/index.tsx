import { ProductHero } from "@/features/ProductHero";
import { ProductInformation } from "@/features/ProductInformation";
import styles from "./index.module.css";

export function Product() {
    return (
        <div className={styles["page"]}>
            <ProductHero />
            <ProductInformation />
        </div>
    );
}
