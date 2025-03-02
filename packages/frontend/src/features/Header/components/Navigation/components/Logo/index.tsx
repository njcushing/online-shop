import { Link } from "react-router-dom";
import styles from "./index.module.css";

export function Logo() {
    return (
        <Link to="/" className={styles["logo"]}>
            Cafree
        </Link>
    );
}
