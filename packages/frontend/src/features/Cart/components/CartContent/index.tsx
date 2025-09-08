import { useContext } from "react";
import { Link } from "react-router-dom";
import { IUserContext, UserContext } from "@/pages/Root";
import { CartSummary } from "@/features/Cart/components/CartSummary";
import styles from "./index.module.css";

export function CartContent() {
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
                    CartItemProps={{ editableQuantity: true, QuantitySize: "md" }}
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
