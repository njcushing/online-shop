import { useContext, useEffect, useCallback, useRef, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutPaymentFormData, checkoutPaymentFormDataSchema } from "@/utils/schemas/checkout";
import { useForm, SubmitHandler } from "react-hook-form";
import { Collapse, Button } from "@mantine/core";
import { createError } from "@/utils/createError";
import _ from "lodash";
import styles from "./index.module.css";

export type TPayment = {
    isOpen: boolean;
    onReturn?: () => void;
    onSubmit?: SubmitHandler<CheckoutPaymentFormData>;
};

export function PaymentForm({ isOpen = false, onReturn, onSubmit }: TPayment) {
    const { user, cart } = useContext(UserContext);

    const { awaiting: userAwaiting } = user;
    const { awaiting: cartAwaiting } = cart;

    const defaultValues = useMemo(() => {
        return {};
    }, []);

    const {
        // control,
        handleSubmit,
        formState: { errors },
        reset,
        // getValues,
        // setValue,
    } = useForm<CheckoutPaymentFormData>({
        defaultValues,
        mode: "onTouched",
        resolver: zodResolver(checkoutPaymentFormDataSchema),
    });

    useEffect(() => reset(defaultValues), [defaultValues, reset]);

    const getError = useCallback(
        (name: string) => {
            const fieldError = _.get(errors, `${name}.message`);
            return createError(typeof fieldError === "string" ? fieldError : undefined);
        },
        [errors],
    );

    const disableInputs = userAwaiting || cartAwaiting || !isOpen;

    const firstInputRef = useRef<HTMLInputElement>(null);
    const focusFirstInput = useCallback(() => {
        if (isOpen && firstInputRef.current) firstInputRef.current.focus();
    }, [isOpen]);

    return (
        <Collapse in={isOpen} animateOpacity={false} onTransitionEnd={() => focusFirstInput()}>
            <div className={styles["checkout-details-section-content"]}>
                <form
                    className={styles["form"]}
                    aria-label="checkout shipping"
                    onSubmit={onSubmit && handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className={styles["button-container"]}>
                        <Button
                            type="button"
                            color="rgb(48, 48, 48)"
                            variant="filled"
                            radius={9999}
                            onClick={() => onReturn && onReturn()}
                            disabled={disableInputs}
                            className={styles["previous-stage-button"]}
                        >
                            Return to shipping
                        </Button>
                    </div>
                </form>
            </div>
        </Collapse>
    );
}
