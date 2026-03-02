import { useEffect } from "react";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function Delivery() {
    useEffect(() => {
        document.title = `Delivery | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <Header disableActivity reduced />

            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}></div>
            </div>

            <Footer reduced />
        </div>
    );
}
