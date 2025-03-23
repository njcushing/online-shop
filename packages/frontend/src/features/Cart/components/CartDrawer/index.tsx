import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Drawer } from "@mantine/core";
import { CartItem } from "../CartItem";
import styles from "./index.module.css";

export type TCartDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function CartDrawer({ opened = false, onClose }: TCartDrawer) {
    const { cart } = useContext(UserContext);

    return (
        <Drawer
            position="right"
            opened={opened}
            onClose={() => onClose && onClose()}
            title="Your cart"
            classNames={{
                root: styles["drawer-root"],
                content: styles["drawer-content"],
                header: styles["drawer-header"],
                title: styles["drawer-title"],
                body: styles["drawer-body"],
            }}
        >
            <ul className={styles["cart-drawer-items"]}>
                {cart.data.map((item) => {
                    return <CartItem data={item} key={item.variant.id} />;
                })}
            </ul>
        </Drawer>
    );
}
