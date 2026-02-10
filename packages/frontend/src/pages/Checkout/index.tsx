import { useEffect } from "react";
import { CheckoutContent } from "@/features/CheckoutContent";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function Checkout() {
    useEffect(() => {
        document.title = `Checkout | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <CheckoutContent />
        </div>
    );
}
