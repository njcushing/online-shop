import { Link } from "react-router-dom";
import styles from "./index.module.css";

export type TOAuthButton = {
    href: string;
    icon: React.ReactNode;
    label: string;
};

export function OAuthButton({ href, icon, label }: TOAuthButton) {
    return (
        <Link to={href || ""} className={styles["oauth-link"]}>
            {icon}
            <div className={styles["label-container"]}>{label}</div>
        </Link>
    );
}
