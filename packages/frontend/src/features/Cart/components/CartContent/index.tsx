import { useContext } from "react";
import { Link } from "react-router-dom";
import { useMatches } from "@mantine/core";
import { IUserContext, UserContext } from "@/pages/Root";
import { CartSummary } from "@/features/Cart/components/CartSummary";
import styles from "./index.module.css";
import { TCartItem } from "../CartItem";

export function CartContent() {
    const CartItemQuantitySize = useMatches<TCartItem["QuantitySize"]>({ base: "sm", xs: "md" });

    const { cart, defaultData } = useContext(UserContext);

    const { response, awaiting } = cart;

    let cartData = defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>;
    if (response.data) cartData = response.data;

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
                    data-disabled={awaiting || items.length === 0}
                >
                    Proceed to checkout
                </Link>
            </div>
        </section>
    );
}
