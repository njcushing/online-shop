import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/LoginForm";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Login | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <LoginForm onSuccess={() => navigate("/")} />
        </div>
    );
}
