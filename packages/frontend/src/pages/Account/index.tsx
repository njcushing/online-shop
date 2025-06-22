import { AccountSettings } from "@/features/AccountSettings";
import styles from "./index.module.css";

export function Account() {
    return (
        <div className={styles["page"]}>
            <AccountSettings />
        </div>
    );
}
