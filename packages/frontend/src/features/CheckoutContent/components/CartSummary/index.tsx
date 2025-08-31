import { useContext, useMemo } from "react";
import { RootContext, IUserContext, UserContext } from "@/pages/Root";
import { useMatches, Skeleton, Divider, CloseButton, Accordion } from "@mantine/core";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { settings } from "@settings";
import { CartItem } from "@/features/Cart/components/CartItem";
import styles from "./index.module.css";

export type TCartSummary = {
    layout?: "wide" | "thin";
};

export function CartSummary({ layout = "wide" }: TCartSummary) {
    const { headerInfo } = useContext(RootContext);
    const { cart, shipping, defaultData } = useContext(UserContext);

    const { response, awaiting } = cart;

    let cartData = defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>;
    if (response.data) cartData = response.data;

    const { items, promotions } = cartData;
    const { cost, discount } = calculateCartSubtotal(cartData);
    const { total } = cost;
    const { freeDeliveryThreshold, expressDeliveryCost } = settings;
    const { value: selectedShipping } = shipping;
    let postageCost = 0;
    const meetsThreshold = total >= freeDeliveryThreshold;
    if (selectedShipping === "express") postageCost = meetsThreshold ? 0 : expressDeliveryCost;
    const subtotal = total + postageCost;

    const wide = useMatches({ base: false, xs: true });

    const title = layout === "wide" ? "Cart summary" : "Review your items";

    const cartItems = useMemo(() => {
        return items.map((item) => {
            return (
                <CartItem
                    data={item}
                    editableQuantity={false}
                    classNames={{
                        name: styles["cart-item-name"],
                        content: styles["cart-item-content"],
                        variantOptionName: styles["cart-item-variant-option-name"],
                        variantOptionValue: styles["cart-item-variant-option-value"],
                        quantity: styles["cart-item-quantity"],
                        price: {
                            current: styles["price-current"],
                            base: styles["price-base"],
                            discountPercentage: styles["price-discount-percentage"],
                        },
                    }}
                    key={item.variant.id}
                />
            );
        });
    }, [items]);

    const costBreakdown = useMemo(() => {
        return (
            <>
                <div className={styles["cost-breakdown-group"]}>
                    <div className={styles["cost-breakdown-line"]}>
                        <Skeleton visible={awaiting} width="min-content">
                            <span style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                Item(s) Subtotal:
                            </span>
                        </Skeleton>
                        <Skeleton visible={awaiting} width="min-content">
                            <span style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                £{(cost.products / 100).toFixed(2)}
                            </span>
                        </Skeleton>
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
                                <span>-£{(discount.promotions.total / 100).toFixed(2)}</span>
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
                                                className={styles["delete-promotion-button"]}
                                            />
                                            <div
                                                className={
                                                    styles["promotion-code-description-container"]
                                                }
                                            >
                                                <p className={styles["promotion-code"]}>{code}</p>
                                                {wide && "-"}
                                                <p className={styles["promotion-description"]}>
                                                    {description}
                                                </p>
                                            </div>
                                            <p className={styles["promotion-discount-value"]}>
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
                            <Skeleton visible={awaiting} width="min-content">
                                <span
                                    style={{
                                        visibility: awaiting ? "hidden" : "initial",
                                    }}
                                >
                                    Postage:
                                </span>
                            </Skeleton>
                            <Skeleton visible={awaiting} width="min-content">
                                <span
                                    style={{
                                        visibility: awaiting ? "hidden" : "initial",
                                    }}
                                >
                                    {`${postageCost !== 0 ? `£${(postageCost / 100).toFixed(2)}` : "FREE"}`}
                                </span>
                            </Skeleton>
                        </div>

                        <Divider className={styles["divider"]} />

                        <div className={styles["cost-breakdown-line"]}>
                            <Skeleton visible={awaiting} width="min-content">
                                <span
                                    style={{
                                        visibility: awaiting ? "hidden" : "initial",
                                    }}
                                >
                                    Total:
                                </span>
                            </Skeleton>
                            <Skeleton visible={awaiting} width="min-content">
                                <span
                                    style={{
                                        visibility: awaiting ? "hidden" : "initial",
                                    }}
                                >
                                    £{(subtotal / 100).toFixed(2)}
                                </span>
                            </Skeleton>
                        </div>
                    </>
                )}
            </>
        );
    }, [
        awaiting,
        cost.products,
        discount.products,
        discount.promotions.individual,
        discount.promotions.total,
        discount.subscriptions,
        items,
        postageCost,
        promotions,
        subtotal,
        wide,
    ]);

    if (layout === "wide") {
        return (
            <div className={styles["cart-summary"]} data-layout={layout}>
                <h3 className={styles["cart-summary-header"]}>{title}</h3>

                <Divider className={styles["divider"]} />

                {items && items.length > 0 ? (
                    <ul className={styles["cart-items"]}>{cartItems}</ul>
                ) : (
                    <p className={styles["empty-cart-message"]}>Your cart is empty.</p>
                )}

                <Divider className={styles["divider"]} />

                {costBreakdown}
            </div>
        );
    }

    return (
        <div className={styles["cart-summary"]} data-layout={layout}>
            <Accordion
                classNames={{
                    root: styles["accordion-root"],
                    item: styles["accordion-item"],
                    control: styles["accordion-control"],
                    content: styles["accordion-content"],
                }}
                style={{ maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)` }}
            >
                <Accordion.Item value="Order Details">
                    <Accordion.Control
                        classNames={{ label: styles["accordion-label"] }}
                        disabled={awaiting}
                    >
                        <Skeleton visible={awaiting} width="min-content">
                            <span
                                style={{
                                    visibility: awaiting ? "hidden" : "initial",
                                    textWrap: "nowrap",
                                }}
                            >
                                Order Details
                            </span>
                        </Skeleton>
                        <Skeleton visible={awaiting} width="min-content">
                            <span
                                style={{
                                    visibility: awaiting ? "hidden" : "initial",
                                    textWrap: "nowrap",
                                }}
                            >
                                £{(subtotal / 100).toFixed(2)}
                            </span>
                        </Skeleton>
                    </Accordion.Control>

                    <Accordion.Panel
                        className={styles["accordion-panel"]}
                        style={{ opacity: 1 }} // Override default opacity transition
                    >
                        <>
                            <div className={styles["accordion-content-top"]}>
                                {items && items.length > 0 ? (
                                    <ul className={styles["cart-items"]}>{cartItems}</ul>
                                ) : (
                                    <p className={styles["empty-cart-message"]}>
                                        Your cart is empty.
                                    </p>
                                )}
                            </div>

                            <div className={styles["accordion-content-bottom"]}>
                                {costBreakdown}
                            </div>
                        </>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}
