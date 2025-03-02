import { Navigation } from "./components/Navigation";
import styles from "./index.module.css";

export function Header() {
    return (
        <header className={styles["header"]}>
            <Navigation />
        </header>
    );
}
