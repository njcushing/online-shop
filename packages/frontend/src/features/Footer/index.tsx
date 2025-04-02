import { Divider } from "@mantine/core";
import { Logo } from "../Logo";
import styles from "./index.module.css";

export function Footer() {
    return (
        <footer className={styles["footer"]}>
            <div className={styles["footer-width-controller"]}>
                <div className={styles["column-1"]}>
                    <Logo size="l" />
                    <p className={styles["copyright-message"]}>© njcushing 2025</p>
                </div>
                <Divider size="sm" orientation="vertical" color="black" />
            </div>
        </footer>
    );
}
