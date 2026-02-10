import { useEffect } from "react";
import { AccountDetails } from "@/features/AccountDetails";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export { Routes } from "@/features/AccountDetails/routes";

export function Account() {
    useEffect(() => {
        document.title = `Your Account | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <AccountDetails />
        </div>
    );
}
