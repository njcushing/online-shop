import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Drawer } from "@mantine/core";
import { UserContext } from "@/pages/Root";
import { calculateSubtotal } from "@/utils/products/cart";
import { DeliveryProgress } from "@/features/DeliveryProgress";
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

            <Divider variant="dashed" />

            <div className={styles["cart-drawer-bottom"]}>
                <div className={styles["subtotal"]}>
                    {`Subtotal: `}
                    <span className={styles["subtotal-value"]}>
                        £{(calculateSubtotal(cart.data) / 100).toFixed(2)}
                    </span>
                </div>

                <DeliveryProgress />

                <Button
                    component={Link}
                    to="/checkout"
                    color="#242424"
                    classNames={{
                        root: styles["checkout-button-root"],
                        label: styles["checkout-button-label"],
                    }}
                >
                    Proceed to Checkout
                </Button>
            </div>
        </Drawer>
    );
}
