import { Drawer } from "@mantine/core";
import { mockCart } from "@/utils/products/cart";
import { CartItem } from "../CartItem";
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
            classNames={{
                root: styles["drawer-root"],
                content: styles["drawer-content"],
                header: styles["drawer-header"],
                title: styles["drawer-title"],
                body: styles["drawer-body"],
            }}
        >
            {mockCart.map((item) => {
                return <CartItem itemData={item} key={item.variantId} />;
            })}
        </Drawer>
    );
}
