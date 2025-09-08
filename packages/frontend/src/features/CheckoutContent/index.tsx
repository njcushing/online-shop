import { useContext, useState } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Divider, Button, Box } from "@mantine/core";
import { NumberCircleOne, NumberCircleTwo, NumberCircleThree } from "@phosphor-icons/react";
import { CartSummary } from "@/features/Cart/components/CartSummary";
import { PersonalInformationForm } from "./components/PersonalInformationForm";
import { ShippingForm } from "./components/ShippingForm";
import { PaymentForm } from "./components/PaymentForm";
import styles from "./index.module.css";

export function CheckoutContent() {
    const { cart, defaultData } = useContext(UserContext);

    const { response, awaiting } = cart;

    let cartData = defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>;
    if (response.data) cartData = response.data;

    const { items } = cartData;

    const [stage, setStage] = useState<"personal" | "shipping" | "payment">("personal");

    return (
        <section className={styles["checkout-content"]}>
            <Box hiddenFrom="lg">
                <CartSummary
                    layout="dropdown"
                    classNames={{ header: styles["CartSummary-header"] }}
                />
            </Box>

            <div className={styles["checkout-content-width-controller"]}>
                <div className={styles["checkout-content-left"]}>
                    <h2 className={styles["checkout-header"]}>Checkout</h2>

                    <Divider className={styles["divider"]} />

                    <div className={styles["checkout-details-section"]}>
                        <div className={styles["panel"]}>
                            <NumberCircleOne weight="fill" size="2rem" />
                            <span className={styles["panel-title"]}>Personal</span>
                        </div>
                        <PersonalInformationForm
                            isOpen={stage === "personal"}
                            onSubmit={() => setStage("shipping")}
                        />
                    </div>

                    <Divider className={styles["divider-light"]} />

                    <div className={styles["checkout-details-section"]}>
                        <div className={styles["panel"]}>
                            <NumberCircleTwo weight="fill" size="2rem" />
                            <span className={styles["panel-title"]}>Shipping</span>
                        </div>
                        <ShippingForm
                            isOpen={stage === "shipping"}
                            onReturn={() => setStage("personal")}
                            onSubmit={() => setStage("payment")}
                        />
                    </div>

                    <Divider className={styles["divider-light"]} />

                    <div className={styles["checkout-details-section"]}>
                        <div className={styles["panel"]}>
                            <NumberCircleThree weight="fill" size="2rem" />
                            <span className={styles["panel-title"]}>Payment</span>
                        </div>
                        <PaymentForm
                            isOpen={stage === "payment"}
                            onReturn={() => setStage("shipping")}
                            onSubmit={() => {}}
                        />
                    </div>
                </div>

                <Box visibleFrom="lg">
                    <div className={styles["checkout-content-right"]}>
                        <CartSummary
                            layout="visible"
                            classNames={{ header: styles["CartSummary-header"] }}
                        />

                        <Button
                            color="var(--site-colour-tertiary, rgb(250, 223, 198))"
                            variant="filled"
                            className={styles["pay-now-button"]}
                            disabled={awaiting || items.length === 0}
                        >
                            Pay now
                        </Button>
                    </div>
                </Box>
            </div>
        </section>
    );
}
