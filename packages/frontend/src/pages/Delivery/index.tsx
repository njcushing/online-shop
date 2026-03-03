import { useEffect } from "react";
import { Header } from "@/features/Header";
import { Footer } from "@/features/Footer";
import { Truck } from "@phosphor-icons/react";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function Delivery() {
    useEffect(() => {
        document.title = `Delivery | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <span>
                <Header disableActivity reduced />
            </span>

            <div className={styles["page-content"]}>
                <div className={styles["page-content-width-controller"]}>
                    <span className={styles["heading-container"]}>
                        <Truck color="rgba(0, 0, 0, 0.2)" size={120} className={styles["symbol"]} />

                        <h1 className={styles["title"]}>Delivery Information</h1>
                    </span>
                </div>
            </div>

            <Footer reduced />
        </div>
    );
}
