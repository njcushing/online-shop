import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Divider } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { CartItem } from "../Cart/components/CartItem";
import styles from "./index.module.css";

export function CheckoutContent() {
    const { cart, defaultData } = useContext(UserContext);
    const { response, awaiting } = cart;
    const { data } = response;

    const cartItems = !awaiting
        ? data
        : (defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>);

    const { cost, discount } = calculateCartSubtotal(cartItems || []);

    return cartItems ? (
        <section className={styles["checkout-content"]}>
            <div className={styles["checkout-content-width-controller"]}>
                <div className={styles["checkout-content-left"]}>
                    <h2 className={styles["checkout-header"]}>Checkout</h2>

                    <Divider className={styles["divider"]} />
                </div>

                <div className={styles["checkout-content-right"]}>
                    <div
                        className={styles["cart-summary"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        <h3 className={styles["cart-summary-header"]}>Cart summary</h3>

                        <Divider className={styles["divider"]} />

                        <ul className={styles["cart-items"]}>
                            {cartItems.map((item) => {
                                return (
                                    <CartItem
                                        data={item}
                                        editableQuantity={false}
                                        classNames={{
                                            name: styles["cart-item-name"],
                                            content: styles["cart-item-content"],
                                            variantOptionName:
                                                styles["cart-item-variant-option-name"],
                                            variantOptionValue:
                                                styles["cart-item-variant-option-value"],
                                            quantity: styles["cart-item-quantity"],
                                            price: {
                                                current: styles["price-current"],
                                                base: styles["price-base"],
                                                discountPercentage:
                                                    styles["price-discount-percentage"],
                                            },
                                        }}
                                        key={item.variant.id}
                                    />
                                );
                            })}
                        </ul>

                        <Divider className={styles["divider"]} />

                        <div className={styles["cost-breakdown-group"]}>
                            <div className={styles["cost-breakdown-line"]}>
                                <span>Item(s) Subtotal:</span>
                                <span>£{(cost.products / 100).toFixed(2)}</span>
                            </div>

                            {discount.products !== 0 && (
                                <div className={styles["cost-breakdown-line"]}>
                                    <span>Item Discounts:</span>
                                    <span>-£{(discount.products / 100).toFixed(2)}</span>
                                </div>
                            )}

                            {discount.subscriptions !== 0 && (
                                <div className={styles["cost-breakdown-line"]}>
                                    <span>Subscriptions:</span>
                                    <span>-£{(discount.subscriptions / 100).toFixed(2)}</span>
                                </div>
                            )}

                            {discount.promotions !== 0 && (
                                <div className={styles["cost-breakdown-line"]}>
                                    <span>Promotions</span>
                                    <span>-£{(discount.promotions / 100).toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <Divider className={styles["divider"]} />

                        <div className={styles["cost-breakdown-line"]}>
                            <span>Postage:</span>
                            <span>
                                {`${cost.postage !== 0 ? `£${(cost.postage / 100).toFixed(2)}` : "FREE"}`}
                            </span>
                        </div>

                        <Divider className={styles["divider"]} />

                        <div className={styles["cost-breakdown-line"]}>
                            <span>Total:</span>
                            <span>£{(cost.total / 100).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    ) : null;
}
