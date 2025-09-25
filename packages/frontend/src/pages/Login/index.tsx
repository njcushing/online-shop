import { LoginForm } from "@/features/LoginForm";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export function Login() {
    const navigate = useNavigate();

    return (
        <div className={styles["page"]}>
            <LoginForm onSuccess={() => navigate("/")} />
        </div>
    );
}
