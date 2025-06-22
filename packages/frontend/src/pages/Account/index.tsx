import { AccountSettings, Routes as AccountSettingsRoutes } from "@/features/AccountSettings";
import styles from "./index.module.css";

export const Routes = [...AccountSettingsRoutes];

export function Account() {
    return (
        <div className={styles["page"]}>
            <AccountSettings />
        </div>
    );
}
