import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Skeleton, Button, Divider, Drawer } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { settings } from "@settings";
import { CartItem } from "../CartItem";
import styles from "./index.module.css";

export type TCartDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function CartDrawer({ opened = false, onClose }: TCartDrawer) {
    const { cart, shipping, defaultData } = useContext(UserContext);
    const { response, awaiting } = cart;
    const { data } = response;

    let cartData = defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>;
    if (data) cartData = data;

    const { items } = cartData;

    const { total } = calculateCartSubtotal(cartData).cost;
    const { freeDeliveryThreshold, expressDeliveryCost } = settings;
    const { value: selectedShipping } = shipping;
    let postageCost = 0;
    const meetsThreshold = total >= freeDeliveryThreshold;
    if (selectedShipping === "express") postageCost = meetsThreshold ? 0 : expressDeliveryCost;
    const subtotal = total + postageCost;

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
                close: styles["drawer-close"],
            }}
        >
            <ul className={styles["cart-drawer-items"]}>
                {items &&
                    items.map((item) => {
                        return <CartItem data={item} key={item.variant.id} />;
                    })}
            </ul>

            <Divider variant="dashed" />

            <div className={styles["cart-drawer-bottom"]}>
                <div className={styles["subtotal"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <span
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`Subtotal: `}</span>
                    </Skeleton>
                    <Skeleton visible={awaiting} width="min-content">
                        <span
                            className={styles["subtotal-value"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            £{(subtotal / 100).toFixed(2)}
                        </span>
                    </Skeleton>
                </div>

                <Skeleton visible={awaiting}>
                    <span style={{ visibility: awaiting ? "hidden" : "initial" }}>
                        <DeliveryProgress />
                    </span>
                </Skeleton>

                {
                    // Component polymorphism to react-router-dom Link converts Button to <a> tag;
                    // 'disabled' prop doesn't work, clicks have to be intercepted with
                    // e.preventDefault
                }

                <Button
                    component={Link}
                    to="/checkout"
                    color="#242424"
                    onClick={(e) => awaiting && e.preventDefault()}
                    disabled={awaiting}
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
