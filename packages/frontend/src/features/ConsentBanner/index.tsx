import { Modal, Button } from "@mantine/core";
import styles from "./index.module.css";

export function ConsentBanner() {
    return (
        <Modal
            opened
            size="100%"
            withCloseButton={false}
            closeOnClickOutside={false}
            onClose={() => {}}
            classNames={{
                inner: styles["modal-inner"],
                content: styles["modal-content"],
                header: styles["modal-header"],
                body: styles["modal-body"],
                close: styles["modal-close"],
            }}
        >
            <h2 className={styles["header"]}>This site uses cookies</h2>
            <div className={styles["buttons-container"]}>
                <Button
                    onClick={() => {}}
                    color="rgb(5, 145, 28)"
                    variant="filled"
                    className={styles["button"]}
                >
                    Accept cookies
                </Button>
                <Button
                    onClick={() => {}}
                    color="rgb(5, 145, 28)"
                    variant="filled"
                    className={styles["button"]}
                >
                    Reject cookies
                </Button>
            </div>
        </Modal>
    );
}
