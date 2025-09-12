import { AccountDetails } from "@/features/AccountDetails";
import styles from "./index.module.css";

export { Routes } from "@/features/AccountDetails/routes";

export function Account() {
    return (
        <div className={styles["page"]}>
            <AccountDetails />
        </div>
    );
}
