import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Divider, Drawer } from "@mantine/core";
import { CartItem } from "../CartItem";
import styles from "./index.module.css";

export type TCartDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

const calculateSubtotal = (cart: IUserContext["cart"]["data"]): number => {
    return cart.reduce((acc, item) => acc + item.variant.price.current * item.quantity, 0);
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

            <Divider />

            <div className={styles["cart-drawer-bottom"]}>
                <div className={styles["subtotal"]}>
                    {`Subtotal: `}
                    <span className={styles["subtotal-value"]}>
                        £{(calculateSubtotal(cart.data) / 100).toFixed(2)}
                    </span>
                </div>
            </div>
        </Drawer>
    );
}
