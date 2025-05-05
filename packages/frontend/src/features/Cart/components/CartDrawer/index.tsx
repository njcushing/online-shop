import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Skeleton, SkeletonProps, Button, Divider, Drawer } from "@mantine/core";
import { calculateSubtotal } from "@/utils/products/cart";
import { DeliveryProgress } from "@/features/DeliveryProgress";
import { CartItem } from "../CartItem";
import styles from "./index.module.css";

export type TCartDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function CartDrawer({ opened = false, onClose }: TCartDrawer) {
    const { cart, defaultData } = useContext(UserContext);
    const { awaiting } = cart;

    const data = cart.data || (defaultData.cart as NonNullable<IUserContext["cart"]["data"]>);

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
                {data &&
                    data.map((item) => {
                        return <CartItem data={item} key={item.variant.id} />;
                    })}
            </ul>

            <Divider variant="dashed" />

            <div className={styles["cart-drawer-bottom"]}>
                <div className={styles["subtotal"]}>
                    <Skeleton
                        visible={awaiting}
                        width="min-content"
                        classNames={SkeletonClassNames}
                    >
                        <span
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >{`Subtotal: `}</span>
                    </Skeleton>
                    <Skeleton
                        visible={awaiting}
                        width="min-content"
                        classNames={SkeletonClassNames}
                    >
                        <span
                            className={styles["subtotal-value"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            £{(calculateSubtotal(data || []) / 100).toFixed(2)}
                        </span>
                    </Skeleton>
                </div>

                <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
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
