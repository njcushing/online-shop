import { Link } from "react-router-dom";
import styles from "./index.module.css";

export type TLogo = {
    onClick?: () => unknown;
};

export function Logo({ onClick }: TLogo) {
    return (
        <Link to="/" onClick={() => onClick && onClick()} className={styles["logo"]}>
            <p>CAFREE</p>
        </Link>
    );
}
