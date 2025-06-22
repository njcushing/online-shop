import { AccountDetails, Routes as AccountSettingsRoutes } from "@/features/AccountDetails";
import styles from "./index.module.css";

export const Routes = [...AccountSettingsRoutes];

export function Account() {
    return (
        <div className={styles["page"]}>
            <AccountDetails />
        </div>
    );
}
