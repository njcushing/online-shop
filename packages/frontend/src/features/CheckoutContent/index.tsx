import { useContext, useState } from "react";
import { UserContext } from "@/pages/Root";
import { useMatches, Divider, Button, Box } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { CartSummary } from "@/features/Cart/components/CartSummary";
import { Cart } from "@/utils/products/cart";
import { PersonalInformationForm } from "./components/PersonalInformationForm";
import { ShippingForm } from "./components/ShippingForm";
import { PaymentForm } from "./components/PaymentForm";
import styles from "./index.module.css";

export function CheckoutContent() {
    const narrow = useMatches({ base: true, lg: false }, { getInitialValueInEffect: false });

    const { user, cart, defaultData } = useContext(UserContext);

    let cartData = defaultData.cart as Cart;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "user", context: user },
            { name: "cart", context: cart },
        ],
    });

    if (!awaitingAny) {
        if (data.cart) cartData = data.cart;
    }

    const [stage, setStage] = useState<"personal" | "shipping" | "payment">("personal");

    const { items } = cartData;

    /**
     * Using 'data-testid' attribute on the CartSummary components because both are accessible in
     * the DOM using JSDOM environment for my test suite (Mantine's 'hiddenFrom' and 'visibleFrom'
     * component props don't hide the components that don't match the media queries in my tests),
     * meaning I can't easily access just one of them in my unit tests. I think this is okay though
     * because only one should be visible and accessible at any point at runtime.
     */

    return (
        <section className={styles["checkout-content"]}>
            {narrow && (
                <CartSummary
                    data-testid="CartSummary-narrow"
                    layout="dropdown"
                    classNames={{
                        collapse: {
                            button: { label: styles["CartSummary-collapse-button-label"] },
                        },
                    }}
                />
            )}

            <div className={styles["checkout-content-width-controller"]}>
                <div className={styles["checkout-content-left"]}>
                    <h2 className={styles["checkout-header"]}>Checkout</h2>

                    <Divider className={styles["divider"]} />

                    <PersonalInformationForm
                        isOpen={stage === "personal"}
                        onSubmit={() => setStage("shipping")}
                    />

                    <Divider className={styles["divider-light"]} />

                    <ShippingForm
                        isOpen={stage === "shipping"}
                        onReturn={() => setStage("personal")}
                        onSubmit={() => setStage("payment")}
                    />

                    <Divider className={styles["divider-light"]} />

                    <PaymentForm
                        isOpen={stage === "payment"}
                        onReturn={() => setStage("shipping")}
                    />
                </div>

                <Box visibleFrom="lg">
                    <div className={styles["checkout-content-right"]}>
                        <CartSummary
                            data-testid="CartSummary-wide"
                            layout="visible"
                            classNames={{ header: styles["CartSummary-header"] }}
                        />

                        <Button
                            color="var(--site-colour-tertiary, rgb(250, 223, 198))"
                            variant="filled"
                            className={styles["pay-now-button"]}
                            disabled={awaitingAny || items.length === 0}
                        >
                            Pay now
                        </Button>
                    </div>
                </Box>
            </div>
        </section>
    );
}
