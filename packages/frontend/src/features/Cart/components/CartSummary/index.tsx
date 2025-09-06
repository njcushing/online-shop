import { useContext, useState, useEffect, useMemo } from "react";
import { RootContext, IUserContext, UserContext } from "@/pages/Root";
import {
    useMatches,
    Skeleton,
    Divider,
    CloseButton,
    Input,
    FocusTrap,
    Collapse,
    Button,
} from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { CaretUp, CaretDown } from "@phosphor-icons/react";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import { settings } from "@settings";
import { CartItem, TCartItem } from "@/features/Cart/components/CartItem";
import { RemoveScroll } from "react-remove-scroll";
import { DeepRequired } from "react-hook-form";
import { RecursivePartial } from "@/utils/types";
import _ from "lodash";
import styles from "./index.module.css";

export type TCartSummary = {
    layout?: "dropdown" | "visible";
    headerText?: string;
    CartItemProps?: RecursivePartial<TCartItem>;
    classNames?: {
        root?: string;
        header?: string;
        itemsContainer?: string;
        emptyCartMessage?: string;
        costBreakdown?: {
            group?: string;
            line?: string;
        };
        promotions?: {
            container?: string;
            group?: string;
            code?: string;
            description?: string;
            discountValue?: string;
            deleteButton?: string;
        };
        collapse?: {
            root?: string;
            top?: string;
            bottom?: string;
        };
    };
};

const getConcatenatedClassNames = (
    classNames: TCartSummary["classNames"],
): NonNullable<DeepRequired<TCartSummary["classNames"]>> => {
    return {
        root: `${styles["cart-summary"]} ${classNames?.root}`,
        header: `${styles["cart-summary-header"]} ${classNames?.header}`,
        itemsContainer: `${styles["cart-items"]} ${classNames?.itemsContainer}`,
        emptyCartMessage: `${styles["empty-cart-message"]} ${classNames?.emptyCartMessage}`,
        costBreakdown: {
            group: `${styles["cost-breakdown-group"]} ${classNames?.costBreakdown?.group}`,
            line: `${styles["cost-breakdown-line"]} ${classNames?.costBreakdown?.line}`,
        },
        promotions: {
            container: `${styles["promotions"]} ${classNames?.promotions?.container}`,
            group: `${styles["promotion-options-container"]} ${classNames?.promotions?.group}`,
            code: `${styles["promotion-code"]} ${classNames?.promotions?.code}`,
            description: `${styles["promotion-description"]} ${classNames?.promotions?.description}`,
            discountValue: `${styles["promotion-discount-value"]} ${classNames?.promotions?.discountValue}`,
            deleteButton: `${styles["delete-promotion-button"]} ${classNames?.promotions?.deleteButton}`,
        },
        collapse: {
            root: `${styles["collapse"]} ${classNames?.collapse?.root}`,
            top: `${styles["collapse-content-top"]} ${classNames?.collapse?.top}`,
            bottom: `${styles["collapse-content-bottom"]} ${classNames?.collapse?.bottom}`,
        },
    };
};

export function CartSummary({
    layout = "visible",
    headerText = "",
    CartItemProps,
    classNames,
}: TCartSummary) {
    const concatenatedClassNames = getConcatenatedClassNames(classNames);

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
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        if (layout === "dropdown" && open) window.scrollTo(0, 0);
    }, [layout, open]);

    const [buttonRef, buttonRect] = useResizeObserver();
    const [buttonHeight, setButtonHeight] = useState<number>(0);
    useEffect(() => setButtonHeight(buttonRect.height), [buttonRect]);

    const defaultHeaderText = layout === "visible" ? "Cart summary" : "Review your items";

    const cartItems = useMemo(() => {
        return items.map((item) => {
            const props = _.merge(
                {
                    data: item,
                    editableQuantity: false,
                    classNames: {
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
                    },
                },
                _.cloneDeep(CartItemProps),
            );
            return <CartItem {...props} key={item.variant.id} />;
        });
    }, [CartItemProps, items]);

    const costBreakdown = useMemo(() => {
        return (
            <>
                <div className={concatenatedClassNames.costBreakdown.group}>
                    <div className={concatenatedClassNames.costBreakdown.line}>
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
                        <div className={concatenatedClassNames.costBreakdown.line}>
                            <span>Item Discounts:</span>
                            <span>-£{(discount.products / 100).toFixed(2)}</span>
                        </div>
                    )}

                    {discount.subscriptions !== 0 && (
                        <div className={concatenatedClassNames.costBreakdown.line}>
                            <span>Subscriptions:</span>
                            <span>-£{(discount.subscriptions / 100).toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {items && items.length > 0 && <Divider className={styles["divider"]} />}

                <div className={concatenatedClassNames.promotions.container}>
                    {discount.promotions.total !== 0 && (
                        <>
                            <div className={concatenatedClassNames.costBreakdown.line}>
                                <span>Promotions</span>
                                <span>-£{(discount.promotions.total / 100).toFixed(2)}</span>
                            </div>

                            <div className={concatenatedClassNames.promotions.group}>
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
                                                    concatenatedClassNames.promotions.deleteButton
                                                }
                                            />
                                            <div
                                                className={
                                                    styles["promotion-code-description-container"]
                                                }
                                            >
                                                <p
                                                    className={
                                                        concatenatedClassNames.promotions.code
                                                    }
                                                >
                                                    {code}
                                                </p>
                                                {wide && "-"}
                                                <p
                                                    className={
                                                        concatenatedClassNames.promotions
                                                            .description
                                                    }
                                                >
                                                    {description}
                                                </p>
                                            </div>
                                            <p
                                                className={
                                                    concatenatedClassNames.promotions.discountValue
                                                }
                                            >
                                                £{(value / 100).toFixed(2)}
                                            </p>
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <Input.Wrapper>
                        <Input.Label className={styles["input-label"]}>
                            Enter a promotional code
                        </Input.Label>
                        <div className={styles["promo-code-input-and-button-wrapper"]}>
                            <Input
                                error={null}
                                disabled={awaiting}
                                classNames={{ input: styles["input"] }}
                            />
                            <Button
                                type="button"
                                color="rgb(48, 48, 48)"
                                variant="filled"
                                radius={9999}
                                onClick={() => {}}
                                disabled={awaiting}
                                className={styles["apply-promo-code-button"]}
                            >
                                Apply
                            </Button>
                        </div>
                    </Input.Wrapper>
                </div>

                <Divider className={styles["divider"]} />

                {items && items.length > 0 && (
                    <>
                        <div className={concatenatedClassNames.costBreakdown.line}>
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

                        <div className={concatenatedClassNames.costBreakdown.line}>
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
        concatenatedClassNames,
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

    if (layout === "visible") {
        return (
            <div className={concatenatedClassNames.root} data-layout={layout}>
                <h3 className={concatenatedClassNames.header}>{headerText || defaultHeaderText}</h3>

                <Divider className={styles["divider"]} />

                {items && items.length > 0 ? (
                    <ul className={concatenatedClassNames.itemsContainer}>{cartItems}</ul>
                ) : (
                    <p className={concatenatedClassNames.emptyCartMessage}>Your cart is empty.</p>
                )}

                <Divider className={styles["divider"]} />

                {costBreakdown}
            </div>
        );
    }

    return (
        <>
            <div className={concatenatedClassNames.root} data-layout={layout} data-active={open}>
                <FocusTrap active={open}>
                    <RemoveScroll inert removeScrollBar enabled={open}>
                        {open && <div style={{ minHeight: `${buttonHeight}px` }}></div>}

                        <div
                            className={styles["collapse-container"]}
                            style={{
                                maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)`,
                            }}
                        >
                            <div ref={buttonRef}>
                                <Button
                                    onClick={() => setOpen(!open)}
                                    classNames={{
                                        root: styles["collapse-button-root"],
                                        label: styles["collapse-button-label"],
                                    }}
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

                                    {open ? <CaretUp /> : <CaretDown />}
                                </Button>
                            </div>

                            <Collapse
                                in={open}
                                animateOpacity={false}
                                transitionDuration={0}
                                className={concatenatedClassNames.collapse.root}
                            >
                                <div className={concatenatedClassNames.collapse.top} tabIndex={-1}>
                                    {items && items.length > 0 ? (
                                        <ul className={concatenatedClassNames.itemsContainer}>
                                            {cartItems}
                                        </ul>
                                    ) : (
                                        <p className={concatenatedClassNames.emptyCartMessage}>
                                            Your cart is empty.
                                        </p>
                                    )}
                                </div>

                                <div className={concatenatedClassNames.collapse.bottom}>
                                    {costBreakdown}
                                </div>
                            </Collapse>
                        </div>
                    </RemoveScroll>
                </FocusTrap>
            </div>

            {open && <div className={styles["overlay"]}></div>}
        </>
    );
}
