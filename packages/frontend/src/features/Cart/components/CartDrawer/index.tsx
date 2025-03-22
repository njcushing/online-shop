import { Drawer } from "@mantine/core";
import styles from "./index.module.css";

export type TCartDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function CartDrawer({ opened = false, onClose }: TCartDrawer) {
    return (
        <Drawer
            position="right"
            opened={opened}
            onClose={() => onClose && onClose()}
            title="Your cart"
            className={styles["card-drawer"]}
            classNames={{
                root: styles["drawer-root"],
                content: styles["drawer-content"],
                header: styles["drawer-header"],
                body: styles["drawer-body"],
            }}
        ></Drawer>
    );
}
