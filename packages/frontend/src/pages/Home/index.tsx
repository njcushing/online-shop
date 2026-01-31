import { HomepageContent } from "@/features/HomepageContent";
import styles from "./index.module.css";

export function Home() {
    return (
        <div className={styles["page"]}>
            <HomepageContent />
        </div>
    );
}
