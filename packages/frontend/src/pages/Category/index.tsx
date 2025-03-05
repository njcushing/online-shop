import { CategoryBanner } from "@/features/CategoryBanner";
import styles from "./index.module.css";

export function Category() {
    return (
        <div className={styles["page"]}>
            <CategoryBanner />
        </div>
    );
}
