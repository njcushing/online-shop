import { useEffect } from "react";
import { HomepageContent } from "@/features/HomepageContent";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function Home() {
    useEffect(() => {
        document.title = siteConfig.title;
    }, []);

    return (
        <div className={styles["page"]}>
            <HomepageContent />
        </div>
    );
}
