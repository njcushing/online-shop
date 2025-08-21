import { useContext } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Divider, Button, CloseButton } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { CartItem } from "../Cart/components/CartItem";
import styles from "./index.module.css";

export function CheckoutContent() {
    const { cart, defaultData } = useContext(UserContext);
    const { response, awaiting } = cart;
    const { data } = response;

    let cartData = defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>;
    if (data) cartData = data;

    const { items, promotions } = cartData;

    const { cost, discount } = calculateCartSubtotal(cartData);

    return (
        <section className={styles["checkout-content"]}>
            <div className={styles["checkout-content-width-controller"]}>
                <div className={styles["checkout-content-left"]}>
                    <h2 className={styles["checkout-header"]}>Checkout</h2>

                    <Divider className={styles["divider"]} />
                </div>

                <div className={styles["checkout-content-right"]}>
                    <div className={styles["cart-summary"]}>
                        <h3 className={styles["cart-summary-header"]}>Cart summary</h3>

                        <Divider className={styles["divider"]} />

                        {items && items.length > 0 ? (
                            <ul className={styles["cart-items"]}>
                                {items.map((item) => {
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
                        ) : (
                            <p className={styles["empty-cart-message"]}>Your cart is empty.</p>
                        )}

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
                        </div>

                        {items && items.length > 0 && <Divider className={styles["divider"]} />}

                        {discount.promotions.total !== 0 && (
                            <>
                                <div className={styles["promotions"]}>
                                    <div className={styles["cost-breakdown-line"]}>
                                        <span>Promotions</span>
                                        <span>
                                            -£{(discount.promotions.total / 100).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className={styles["promotion-options-container"]}>
                                        {promotions.map((promotion) => {
                                            const { code, description } = promotion;
                                            const info = discount.promotions.individual.find(
                                                (p) => p.code === code,
                                            );
                                            const value = info?.value || 0;

                                            return (
                                                <span className={styles["promotion"]} key={code}>
                                                    <CloseButton
                                                        size="sm"
                                                        className={
                                                            styles["delete-promotion-button"]
                                                        }
                                                    />
                                                    <p className={styles["promotion-code"]}>
                                                        {code}
                                                    </p>
                                                    -
                                                    <p className={styles["promotion-description"]}>
                                                        {description}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles["promotion-discount-value"]
                                                        }
                                                    >
                                                        £{(value / 100).toFixed(2)}
                                                    </p>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Divider className={styles["divider"]} />
                            </>
                        )}

                        {items && items.length > 0 && (
                            <>
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
                            </>
                        )}
                    </div>

                    <Button
                        color="var(--site-colour-tertiary, rgb(250, 223, 198))"
                        variant="filled"
                        className={styles["pay-now-button"]}
                        disabled={awaiting || items.length === 0}
                    >
                        Pay now
                    </Button>
                </div>
            </div>
        </section>
    );
}
