import { LoginForm } from "@/features/LoginForm";
import styles from "./index.module.css";

export function Login() {
    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <LoginForm />
            </div>
        </div>
    );
}
