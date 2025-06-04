import { useContext, useEffect, useRef, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { UserContext } from "@/pages/Root";
import { Collapse, Alert, AlertProps } from "@mantine/core";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { settings } from "@settings";
import { WarningCircle, Info } from "@phosphor-icons/react";
import styles from "./index.module.css";

const AlertClassNames: AlertProps["classNames"] = {
    root: styles["alert-root"],
    wrapper: styles["alert-wrapper"],
    body: styles["alert-body"],
    title: styles["alert-title"],
    icon: styles["alert-icon"],
};

export function VariantAlerts() {
    const { variant } = useContext(ProductContext);
    const { stock } = variant || { stock: settings.lowStockThreshold + 1 };

    const { cart } = useContext(UserContext);
    const { data: cartData } = cart;

    const cartItemData = useMemo<PopulatedCartItemData | undefined>(() => {
        if (!cartData) return undefined;
        return cartData.find((cartItem) => cartItem.variant.id === variant?.id);
    }, [variant?.id, cartData]);

    const lastValidStockCount = useRef<number>(0);
    const lastValidStockAlert = useRef<"None" | "Low">("None");
    useEffect(() => {
        if (!variant || variant.stock > settings.lowStockThreshold) return;
        lastValidStockCount.current = variant.stock;
        lastValidStockAlert.current = variant.stock === 0 ? "None" : "Low";
    }, [variant]);

    const lastValidCartItemQuantity = useRef<number>(0);
    useEffect(() => {
        const { current } = lastValidCartItemQuantity;
        lastValidCartItemQuantity.current =
            cartItemData && cartItemData.quantity > 0 ? cartItemData.quantity : current;
    }, [cartItemData]);

    return (
        <div className={styles["variant-alerts-container"]}>
            <Collapse
                in={stock <= settings.lowStockThreshold}
                animateOpacity={false}
                transitionDuration={500}
            >
                {(() => {
                    if (lastValidStockAlert.current === "None") {
                        return (
                            <Alert
                                color="red"
                                icon={<WarningCircle weight="bold" size="100%" />}
                                title="Out of stock"
                                classNames={AlertClassNames}
                            >
                                <p>
                                    We are unsure when this item will be back in stock. Check back
                                    soon, or add this item to your watchlist to be notified when it
                                    comes back in stock.
                                </p>
                            </Alert>
                        );
                    }
                    return (
                        <Alert
                            color="yellow"
                            icon={<WarningCircle weight="bold" size="100%" />}
                            title="Low stock"
                            classNames={AlertClassNames}
                        >
                            <p>
                                There {stock === 1 ? "is" : "are"} only{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    {lastValidStockCount.current}
                                </span>{" "}
                                of this item left in stock.
                            </p>
                        </Alert>
                    );
                })()}
            </Collapse>

            <Collapse
                in={!!cartItemData && cartItemData.quantity > 0}
                animateOpacity={false}
                transitionDuration={500}
            >
                <Alert icon={<Info weight="bold" size="100%" />} classNames={AlertClassNames}>
                    You already have{" "}
                    <span style={{ fontWeight: "bold" }}>
                        {cartItemData?.quantity || lastValidCartItemQuantity.current}
                    </span>{" "}
                    of this item in your cart.
                </Alert>
            </Collapse>
        </div>
    );
}
