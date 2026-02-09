import { useState } from "react";
import styles from "./index.module.css";

export function SiteDisclaimer() {
    const [open, setOpen] = useState<boolean>(true);

    if (!open) return null;

    return (
        <div className={styles["site-disclaimer"]}>
            <p className={styles["site-disclaimer-message"]}>
                This site is a portfolio project; any and all information, products and transactions
                are NOT real
            </p>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={styles["site-disclaimer-close-button"]}
            >
                ✖
            </button>
        </div>
    );
}
