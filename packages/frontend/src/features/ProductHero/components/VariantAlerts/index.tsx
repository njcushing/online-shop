import { useContext, useState, useEffect, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { UserContext } from "@/pages/Root";
import { Skeleton, Collapse, Alert, AlertProps } from "@mantine/core";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { settings } from "@settings";
import { WarningCircle, Info } from "@phosphor-icons/react";
import styles from "./index.module.css";

const AlertClassNames: AlertProps["classNames"] = {
    root: styles["alert-root"],
    wrapper: styles["alert-wrapper"],
    body: styles["alert-body"],
    title: styles["alert-title"],
    message: styles["alert-message"],
    icon: styles["alert-icon"],
};

export type TVariantAlerts = {
    awaiting?: boolean;
};

export function VariantAlerts({ awaiting = false }: TVariantAlerts) {
    const { variant } = useContext(ProductContext);
    const { stock } = variant || { stock: settings.lowStockThreshold + 1 };

    const { cart } = useContext(UserContext);
    const { response } = cart;
    const { data: cartData } = response;

    const cartItemData = useMemo<PopulatedCartItemData | undefined>(() => {
        if (!cartData?.items) return undefined;
        return cartData.items.find((cartItem) => cartItem.variant.id === variant?.id);
    }, [variant?.id, cartData]);

    const [lastValidStockCount, setLastValidStockCount] = useState<number>(0);
    const [lastValidStockAlert, setLastValidStockAlert] = useState<"None" | "Low">("None");
    useEffect(() => {
        if (!variant || variant.stock > settings.lowStockThreshold) return;
        setLastValidStockCount(variant.stock);
        setLastValidStockAlert(variant.stock === 0 ? "None" : "Low");
    }, [variant]);

    const [lastValidCartItemQuantity, setLastValidCartItemQuantity] = useState<number>(0);
    useEffect(() => {
        setLastValidCartItemQuantity((current) =>
            cartItemData && cartItemData.quantity > 0 ? cartItemData.quantity : current,
        );
    }, [cartItemData]);

    const stockAlert = useMemo(() => {
        if (lastValidStockAlert === "None") {
            return (
                <Alert
                    color="red"
                    icon={<WarningCircle weight="bold" size="100%" />}
                    title="Out of stock"
                    classNames={AlertClassNames}
                >
                    <p>
                        We are unsure when this item will be back in stock. Check back soon, or add
                        this item to your watchlist to be notified when it comes back in stock.
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
                    <span style={{ fontWeight: "bold" }}>{lastValidStockCount}</span> of this item
                    left in stock.
                </p>
            </Alert>
        );
    }, [lastValidStockCount, lastValidStockAlert, stock]);

    const cartQuantityAlert = useMemo(() => {
        return (
            <Alert icon={<Info weight="bold" size="100%" />} classNames={AlertClassNames}>
                You already have{" "}
                <span style={{ fontWeight: "bold" }}>
                    {cartItemData?.quantity || lastValidCartItemQuantity}
                </span>{" "}
                of this item in your cart.
            </Alert>
        );
    }, [lastValidCartItemQuantity, cartItemData?.quantity]);

    return (
        <div className={styles["variant-alerts-container"]}>
            <Collapse
                in={!awaiting && stock <= settings.lowStockThreshold}
                animateOpacity={false}
                transitionDuration={500}
            >
                <Skeleton visible={awaiting}>
                    <div style={{ visibility: awaiting ? "hidden" : "initial" }}>{stockAlert}</div>
                </Skeleton>
            </Collapse>

            <Collapse
                in={!awaiting && !!cartItemData && cartItemData.quantity > 0}
                animateOpacity={false}
                transitionDuration={500}
            >
                <Skeleton visible={awaiting}>
                    <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                        {cartQuantityAlert}
                    </div>
                </Skeleton>
            </Collapse>
        </div>
    );
}
