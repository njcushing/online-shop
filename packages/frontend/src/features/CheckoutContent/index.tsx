import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Divider } from "@mantine/core";
import styles from "./index.module.css";
import { CartItem } from "../Cart/components/CartItem";

export function CheckoutContent() {
    const { cart } = useContext(UserContext);
    const { response, awaiting } = cart;
    const { data } = response;

    return (
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
                            {data?.map((item) => {
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
                    </div>
                </div>
            </div>
        </section>
    );
}
