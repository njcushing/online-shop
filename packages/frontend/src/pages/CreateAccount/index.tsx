import { AccountCreationForm } from "@/features/AccountCreationForm";
import styles from "./index.module.css";

export function CreateAccount() {
    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <h1 className={styles["page-heading"]}>Sign up to get started</h1>
                <AccountCreationForm />
            </div>
        </div>
    );
}
