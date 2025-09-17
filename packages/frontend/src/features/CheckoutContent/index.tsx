import { useContext, useState, useMemo } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Divider, Button, Box } from "@mantine/core";
import { NumberCircleOne, NumberCircleTwo, NumberCircleThree } from "@phosphor-icons/react";
import { CartSummary } from "@/features/Cart/components/CartSummary";
import { createError } from "@/utils/createError";
import { PersonalInformationForm } from "./components/PersonalInformationForm";
import { ShippingForm } from "./components/ShippingForm";
import { PaymentForm } from "./components/PaymentForm";
import styles from "./index.module.css";

export function CheckoutContent() {
    const { user, cart, defaultData } = useContext(UserContext);

    const { response: userResponse, awaiting: userAwaiting } = user;
    const { response: cartResponse, attempt: cartAttempt, awaiting: cartAwaiting } = cart;

    const { data } = cartResponse;

    const [stage, setStage] = useState<"personal" | "shipping" | "payment">("personal");
    const userDataError = useMemo(() => {
        if (!userAwaiting && !userResponse.data) {
            return createError("Could not load user data");
        }
        return null;
    }, [userAwaiting, userResponse]);

    if (!cartAwaiting && !data) {
        return (
            <section
                className={styles["checkout-content-error"]}
                role="alert"
                aria-live="assertive"
            >
                <div className={styles["checkout-content-error-width-controller"]}>
                    <h1 className={styles["error-header"]}>
                        Sorry! Something went wrong on our end. Your cart could not be loaded.
                    </h1>

                    <div className={styles["error-link-container"]}>
                        Click the button below to try again, or{" "}
                        <Link to="/" className={styles["error-link"]}>
                            click here
                        </Link>{" "}
                        to return to home.
                    </div>

                    <Button
                        onClick={() => cartAttempt()}
                        color="var(--site-colour-tertiary, rgb(250, 223, 198))"
                        variant="filled"
                        className={styles["error-try-again-button"]}
                    >
                        Try again
                    </Button>
                </div>
            </section>
        );
    }

    let cartData = defaultData.cart as NonNullable<IUserContext["cart"]["response"]["data"]>;
    if (data) cartData = data;

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
            <Box hiddenFrom="lg">
                <CartSummary
                    data-testid="CartSummary-narrow"
                    layout="dropdown"
                    classNames={{ header: styles["CartSummary-header"] }}
                />
            </Box>

            <div className={styles["checkout-content-width-controller"]}>
                <div className={styles["checkout-content-left"]}>
                    <h2 className={styles["checkout-header"]}>Checkout</h2>

                    {userDataError}

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
                        />
                    </div>
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
                            disabled={cartAwaiting || items.length === 0}
                        >
                            Pay now
                        </Button>
                    </div>
                </Box>
            </div>
        </section>
    );
}
