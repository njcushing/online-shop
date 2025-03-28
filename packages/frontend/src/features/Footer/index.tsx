import { Divider } from "@mantine/core";
import { Logo } from "../Logo";
import styles from "./index.module.css";

export function Footer() {
    return (
        <footer className={styles["footer"]}>
            <div className={styles["footer-width-controller"]}>
                <Logo size="l" />
                <Divider size="lg" orientation="vertical" color="black" />
            </div>
        </footer>
    );
}
