import { AccountCreationForm } from "@/features/AccountCreationForm";
import styles from "./index.module.css";

export function CreateAccount() {
    return (
        <div className={styles["page"]}>
            <AccountCreationForm />
        </div>
    );
}
