import { useContext, useEffect, useCallback, useRef, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutPersonalFormData, checkoutPersonalFormDataSchema } from "@/utils/schemas/checkout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Collapse, TextInput, Button } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { NumberCircleOne } from "@phosphor-icons/react";
import { Error } from "@/components/UI/Error";
import _ from "lodash";
import { User } from "@/utils/schemas/user";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
        description: styles["form-field-description"],
    },
};

export type TPersonalInformationForm = {
    isOpen: boolean;
    onSubmit?: SubmitHandler<CheckoutPersonalFormData>;
};

export function PersonalInformationForm({ isOpen = false, onSubmit }: TPersonalInformationForm) {
    const { user, cart, defaultData } = useContext(UserContext);

    let userData = defaultData.user as User;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "user", context: user },
            { name: "cart", context: cart },
        ],
    });

    if (!awaitingAny) {
        if (data.user) userData = data.user;
    }

    const personal = userData.profile?.personal;

    const defaultValues = useMemo(() => {
        return {
            firstName: personal?.firstName || "",
            lastName: personal?.lastName || "",
            phone: personal?.phone || "",
            email: personal?.email || "",
        };
    }, [personal]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CheckoutPersonalFormData>({
        defaultValues,
        mode: "onTouched",
        resolver: zodResolver(checkoutPersonalFormDataSchema),
    });

    useEffect(() => reset(defaultValues), [defaultValues, reset]);

    const getError = useCallback(
        (name: string) => {
            const fieldError = _.get(errors, `${name}.message`);
            return <Error message={typeof fieldError === "string" ? fieldError : ""} />;
        },
        [errors],
    );

    const disableInputs = awaitingAny || !isOpen;

    /**
     * Can't invoke callback passed to Mantine Collapse component's 'onTransitionEnd' prop without
     * mocking component (as far as I'm aware)
     */
    /* v8 ignore start */

    const containerRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const focusFirstInput = useCallback(() => {
        if (isOpen) {
            const preventScroll = !!containerRef.current;
            if (firstInputRef.current) firstInputRef.current.focus({ preventScroll });
            if (containerRef.current) containerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen]);

    /* v8 ignore stop */

    return (
        <div className={styles["checkout-details-section"]} ref={containerRef}>
            <div className={styles["panel"]}>
                <NumberCircleOne weight="fill" size="2rem" />
                <span className={styles["panel-title"]}>Personal</span>
            </div>
            <Collapse in={isOpen} animateOpacity={false} onTransitionEnd={focusFirstInput}>
                <div className={styles["checkout-details-section-content"]}>
                    <form
                        className={styles["form"]}
                        aria-label="checkout personal information"
                        onSubmit={onSubmit && handleSubmit(onSubmit)}
                        noValidate
                    >
                        <div className={styles["fields-container"]}>
                            <div className={styles["name-fields-container"]}>
                                <Controller
                                    control={control}
                                    name="firstName"
                                    render={({ field }) => {
                                        return (
                                            <TextInput
                                                {...field}
                                                {...inputProps}
                                                value={field.value}
                                                label="First name"
                                                autoComplete="given-name"
                                                required
                                                error={getError("firstName")}
                                                disabled={disableInputs}
                                                ref={firstInputRef}
                                            />
                                        );
                                    }}
                                />

                                <Controller
                                    control={control}
                                    name="lastName"
                                    render={({ field }) => {
                                        return (
                                            <TextInput
                                                {...field}
                                                {...inputProps}
                                                value={field.value}
                                                label="Last name"
                                                autoComplete="family-name"
                                                required
                                                error={getError("lastName")}
                                                disabled={disableInputs}
                                            />
                                        );
                                    }}
                                />
                            </div>

                            <Controller
                                control={control}
                                name="email"
                                render={({ field }) => {
                                    return (
                                        <TextInput
                                            {...field}
                                            {...inputProps}
                                            value={field.value}
                                            label="Email address"
                                            autoComplete="email"
                                            required
                                            error={getError("email")}
                                            disabled={disableInputs}
                                        />
                                    );
                                }}
                            />

                            <Controller
                                control={control}
                                name="phone"
                                render={({ field }) => {
                                    return (
                                        <TextInput
                                            {...field}
                                            {...inputProps}
                                            value={field.value}
                                            label="Phone number (optional)"
                                            autoComplete="tel"
                                            description="For contacting you with queries about your order"
                                            error={getError("phone")}
                                            disabled={disableInputs}
                                        />
                                    );
                                }}
                            />
                        </div>

                        <Button
                            type="submit"
                            color="rgb(48, 48, 48)"
                            variant="filled"
                            radius={9999}
                            disabled={disableInputs}
                            className={styles["next-stage-button"]}
                        >
                            Continue to shipping
                        </Button>
                    </form>
                </div>
            </Collapse>
        </div>
    );
}
