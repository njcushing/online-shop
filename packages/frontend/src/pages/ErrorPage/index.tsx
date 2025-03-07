import { Link } from "react-router-dom";
import styles from "./index.module.css";

/* Breaking normal naming convention to prevent clash with Error API */
export function ErrorPage() {
    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>
                <h1>{`Oh no! There doesn't seem to be anything here`}</h1>
                <Link to="/">Return to home</Link>
            </div>
        </div>
    );
}
