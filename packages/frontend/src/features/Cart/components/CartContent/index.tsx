import { useContext } from "react";
import { Link } from "react-router-dom";
import { useMatches } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { UserContext } from "@/pages/Root";
import { CartSummary } from "@/features/Cart/components/CartSummary";
import { PopulatedCart } from "@/utils/products/cart";
import { TCartItem } from "../CartItem";
import styles from "./index.module.css";

export function CartContent() {
    const CartItemQuantitySize = useMatches<TCartItem["QuantitySize"]>({ base: "sm", xs: "md" });

    const { cart, defaultData } = useContext(UserContext);

    let cartData = defaultData.cart as PopulatedCart;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "cart", context: cart }],
    });

    if (!awaitingAny) {
        if (data.cart) cartData = data.cart;
    }

    const { items } = cartData;

    return (
        <section className={styles["cart-content"]}>
            <div className={styles["cart-content-width-controller"]}>
                <CartSummary
                    layout="visible"
                    headerText="Your Cart"
                    hideEditLink
                    CartItemProps={{ editableQuantity: true, QuantitySize: CartItemQuantitySize }}
                    classNames={{
                        root: styles["CartSummary-root"],
                        header: styles["CartSummary-header"],
                    }}
                />

                <Link
                    to="/checkout"
                    className={styles["proceed-to-checkout-link"]}
                    data-disabled={awaitingAny || items.length === 0}
                >
                    Proceed to checkout
                </Link>
            </div>
        </section>
    );
}
