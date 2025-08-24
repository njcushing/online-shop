import { useContext, useEffect, useCallback, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutPersonalFormData, checkoutPersonalFormDataSchema } from "@/utils/schemas/checkout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { TextInput, Button } from "@mantine/core";
import { createInputError } from "@/utils/createInputError";
import _ from "lodash";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export type TPersonalInformation = {
    open?: boolean;
    onSubmit?: SubmitHandler<CheckoutPersonalFormData>;
};

export function PersonalInformationForm({ open, onSubmit }: TPersonalInformation) {
    const { user, cart } = useContext(UserContext);

    const { response, awaiting: userAwaiting } = user;
    const { data } = response;
    const { profile } = data || {};
    const { personal } = profile || {};
    const { firstName, lastName, phone, email } = personal || {};

    const { awaiting: cartAwaiting } = cart;

    const defaultValues = useMemo(() => {
        return { personal: { firstName, lastName, phone, email } };
    }, [firstName, lastName, phone, email]);

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
            return createInputError(typeof fieldError === "string" ? fieldError : undefined);
        },
        [errors],
    );

    return (
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
                        name="personal.firstName"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="First name"
                                    required
                                    error={getError("personal.firstName")}
                                    onChange={(v) => {
                                        const { value } = v.target;
                                        field.onChange(value.length > 0 ? value : undefined);
                                    }}
                                    aria-hidden={!open}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name="personal.lastName"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="Last name"
                                    required
                                    error={getError("personal.lastName")}
                                    onChange={(v) => {
                                        const { value } = v.target;
                                        field.onChange(value.length > 0 ? value : undefined);
                                    }}
                                    aria-hidden={!open}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />
                </div>

                <Controller
                    control={control}
                    name="personal.email"
                    render={({ field }) => {
                        return (
                            <TextInput
                                {...field}
                                {...inputProps}
                                value={field.value ?? ""}
                                label="Email address"
                                required
                                error={getError("personal.email")}
                                onChange={(v) => {
                                    const { value } = v.target;
                                    field.onChange(value.length > 0 ? value : undefined);
                                }}
                                aria-hidden={!open}
                                disabled={userAwaiting || cartAwaiting}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="personal.phone"
                    render={({ field }) => {
                        return (
                            <TextInput
                                {...field}
                                {...inputProps}
                                value={field.value ?? ""}
                                label="Phone number (optional)"
                                description="For contacting you with queries about your order"
                                error={getError("personal.firstName")}
                                onChange={(v) => {
                                    const { value } = v.target;
                                    field.onChange(value.length > 0 ? value : undefined);
                                }}
                                aria-hidden={!open}
                                disabled={userAwaiting || cartAwaiting}
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
                disabled={userAwaiting || cartAwaiting}
                className={styles["next-stage-button"]}
            >
                Continue to shipping
            </Button>
        </form>
    );
}
