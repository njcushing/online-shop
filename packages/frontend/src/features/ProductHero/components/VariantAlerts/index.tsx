import { useContext, useEffect, useRef, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { Collapse, Alert, AlertProps } from "@mantine/core";
import { lowStockThreshold } from "@/utils/products/product";
import { CartItemData, mockCart } from "@/utils/products/cart";
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
    const { stock } = variant || { stock: lowStockThreshold + 1 };

    const cartItemData = useMemo<CartItemData | undefined>(() => {
        return mockCart.find((cartItem) => cartItem.variantId === variant?.id);
    }, [variant?.id]);

    const lastValidStockCount = useRef<number>(0);
    const lastValidStockAlert = useRef<"None" | "Low">("None");
    useEffect(() => {
        if (!variant || variant.stock > lowStockThreshold) return;
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
        <>
            <Collapse in={stock <= lowStockThreshold}>
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

            <Collapse in={!!cartItemData && cartItemData.quantity > 0}>
                <Alert icon={<Info weight="bold" size="100%" />} classNames={AlertClassNames}>
                    You already have{" "}
                    <span style={{ fontWeight: "bold" }}>
                        {cartItemData?.quantity || lastValidCartItemQuantity.current}
                    </span>{" "}
                    of this item in your cart.
                </Alert>
            </Collapse>
        </>
    );
}
