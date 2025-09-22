import { Modal } from "@mantine/core";
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
        ></Modal>
    );
}
