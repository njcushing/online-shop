import { Link } from "react-router-dom";
import styles from "./index.module.css";

export type TLogo = {
    size?: "sm" | "md" | "lg";
    onClick?: () => unknown;
};

export function Logo({ size = "md", onClick }: TLogo) {
    return (
        <Link
            to="/"
            onClick={() => onClick && onClick()}
            className={styles["logo"]}
            data-size={size}
        >
            <p>CAFREE</p>
        </Link>
    );
}
