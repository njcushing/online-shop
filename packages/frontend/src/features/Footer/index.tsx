import { Divider } from "@mantine/core";
import { Logo } from "../Logo";
import styles from "./index.module.css";

export function Footer() {
    return (
        <footer className={styles["footer"]}>
            <Logo size="l" />
            <Divider size="lg" orientation="vertical" color="black" />
        </footer>
    );
}
