import { Modal } from "@mantine/core";
import styles from "./index.module.css";

export function ConsentBanner() {
    return <Modal opened onClose={() => {}} className={styles["consent-banner"]}></Modal>;
}
