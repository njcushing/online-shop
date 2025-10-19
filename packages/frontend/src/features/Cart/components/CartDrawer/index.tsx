import { useContext } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Skeleton, Button, Divider, Drawer } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { PopulatedCart } from "@/utils/products/cart";
import { CartItem } from "../CartItem";
import styles from "./index.module.css";

export type TCartDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function CartDrawer({ opened = false, onClose }: TCartDrawer) {
    const { settings } = useContext(RootContext);
    const { cart, shipping, defaultData } = useContext(UserContext);

    const { response: settingsResponse, awaiting: settingsAwaiting } = settings;
    const { response: cartResponse, awaiting: cartAwaiting } = cart;

    const { success: settingsSuccess } = settingsResponse;
    const { success: cartSuccess } = cartResponse;

    const awaitingAny = settingsAwaiting || cartAwaiting;

    let workingCartData = defaultData.cart as PopulatedCart;
    let freeExpressDeliveryThreshold = null;
    let baseExpressDeliveryCost = null;
    let { items } = workingCartData;
    let selectedShipping = null;
    let postageCost = 0;
    let subtotal = 0;

    if (!awaitingAny) {
        if (!settingsSuccess) throw new Error(settingsResponse.message);
        if (!cartSuccess) throw new Error(cartResponse.message);

        const { data: settingsData } = settingsResponse;
        const { data: cartData } = cartResponse;

        workingCartData = cartData;
        freeExpressDeliveryThreshold = settingsData.freeExpressDeliveryThreshold;
        baseExpressDeliveryCost = settingsData.baseExpressDeliveryCost;
        items = workingCartData.items;

        const { total } = calculateCartSubtotal(workingCartData).cost;
        selectedShipping = shipping.value;
        postageCost = 0;
        const meetsThreshold = total >= freeExpressDeliveryThreshold;
        if (selectedShipping === "express") {
            postageCost = meetsThreshold ? 0 : baseExpressDeliveryCost;
        }
        subtotal = total + postageCost;
    }

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
                    <Skeleton visible={awaitingAny} width="min-content">
                        <span
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >{`Subtotal: `}</span>
                    </Skeleton>
                    <Skeleton visible={awaitingAny} width="min-content">
                        <span
                            className={styles["subtotal-value"]}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            £{(subtotal / 100).toFixed(2)}
                        </span>
                    </Skeleton>
                </div>

                <Skeleton visible={awaitingAny}>
                    <span style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
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
                    onClick={(e) => awaitingAny && e.preventDefault()}
                    disabled={awaitingAny}
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
