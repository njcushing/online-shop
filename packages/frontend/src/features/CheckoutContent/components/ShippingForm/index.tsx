import { useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CheckoutShippingOption,
    CheckoutShippingFormData,
    checkoutShippingFormDataSchema,
} from "@/utils/schemas/checkout";
import { useForm, useWatch, Controller, SubmitHandler } from "react-hook-form";
import { TextInput, Collapse, Divider, Checkbox, Radio, RadioProps, Button } from "@mantine/core";
import { createInputError } from "@/utils/createInputError";
import _ from "lodash";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

const radioClassNames: RadioProps["classNames"] = {
    radio: styles["radio"],
    label: styles["radio-label"],
};

export type TShipping = {
    onReturn?: () => void;
    onSubmit?: SubmitHandler<CheckoutShippingFormData>;
};

const emptyBillingFields: CheckoutShippingFormData["address"]["billing"] = {
    line1: "",
    line2: "",
    townCity: "",
    county: "",
    postcode: "",
};

export function ShippingForm({ onReturn, onSubmit }: TShipping) {
    const { user, cart } = useContext(UserContext);

    const { response, awaiting: userAwaiting } = user;
    const { data } = response;
    const { profile } = data || {};
    const { addresses } = profile || {};
    const { delivery } = addresses || {};
    const {
        line1: dLine1,
        line2: dLine2,
        townCity: dTownCity,
        county: dCounty,
        postcode: dPostcode,
    } = delivery || {};

    const { awaiting: cartAwaiting } = cart;

    const defaultValues = useMemo(() => {
        return {
            address: {
                delivery: {
                    line1: dLine1,
                    line2: dLine2,
                    townCity: dTownCity,
                    county: dCounty,
                    postcode: dPostcode,
                },
                billing: emptyBillingFields,
            },
            type: "express" as CheckoutShippingOption,
        };
    }, [dLine1, dLine2, dTownCity, dCounty, dPostcode]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue,
    } = useForm<CheckoutShippingFormData>({
        defaultValues,
        mode: "onTouched",
        resolver: zodResolver(checkoutShippingFormDataSchema),
    });

    useEffect(() => reset(defaultValues), [defaultValues, reset]);

    const getError = useCallback(
        (name: string) => {
            const fieldError = _.get(errors, `${name}.message`);
            return createInputError(typeof fieldError === "string" ? fieldError : undefined);
        },
        [errors],
    );

    const [billingIsDelivery, setBillingIsDelivery] = useState<boolean>(true);
    const currentDeliveryValues = useWatch({ control, name: "address.delivery" });
    const cachedBilling =
        useRef<CheckoutShippingFormData["address"]["billing"]>(emptyBillingFields);
    useEffect(() => {
        if (billingIsDelivery) {
            cachedBilling.current = getValues("address.billing");
            setValue("address.billing", currentDeliveryValues, { shouldValidate: true });
        } else {
            setValue("address.billing", cachedBilling.current);
        }
    }, [getValues, setValue, billingIsDelivery, currentDeliveryValues]);

    return (
        <form
            className={styles["form"]}
            aria-label="checkout shipping"
            onSubmit={onSubmit && handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend className={styles["legend"]}>Delivery address</legend>

                <div className={styles["fields-container"]}>
                    <Controller
                        control={control}
                        name="address.delivery.line1"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="Line 1"
                                    autoComplete="delivery address-line1"
                                    required
                                    error={getError("address.delivery.line1")}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name="address.delivery.line2"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="Line 2"
                                    autoComplete="delivery address-line2"
                                    error={getError("address.delivery.line2")}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name="address.delivery.townCity"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="Town/City"
                                    autoComplete="delivery address-level2"
                                    required
                                    error={getError("address.delivery.townCity")}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name="address.delivery.county"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="County"
                                    error={getError("address.delivery.county")}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name="address.delivery.postcode"
                        render={({ field }) => {
                            return (
                                <TextInput
                                    {...field}
                                    {...inputProps}
                                    value={field.value ?? ""}
                                    label="Postcode"
                                    autoComplete="delivery postal-code"
                                    required
                                    error={getError("address.delivery.postcode")}
                                    disabled={userAwaiting || cartAwaiting}
                                />
                            );
                        }}
                    />
                </div>
            </fieldset>

            <Checkbox
                label="My billing address is the same as my delivery address"
                checked={billingIsDelivery}
                onChange={() => setBillingIsDelivery(!billingIsDelivery)}
                classNames={{
                    root: styles["checkbox-root"],
                    input: styles["checkbox-input"],
                    label: styles["checkbox-label"],
                }}
            />

            <Collapse in={!billingIsDelivery} animateOpacity={false}>
                <fieldset className={styles["fieldset"]}>
                    <legend className={styles["legend"]}>Billing address</legend>

                    <div className={styles["fields-container"]}>
                        <Controller
                            control={control}
                            name="address.billing.line1"
                            render={({ field }) => {
                                return (
                                    <TextInput
                                        {...field}
                                        {...inputProps}
                                        value={field.value ?? ""}
                                        label="Line 1"
                                        autoComplete="billing address-line1"
                                        required
                                        error={getError("address.billing.line1")}
                                        disabled={userAwaiting || cartAwaiting || billingIsDelivery}
                                    />
                                );
                            }}
                        />

                        <Controller
                            control={control}
                            name="address.billing.line2"
                            render={({ field }) => {
                                return (
                                    <TextInput
                                        {...field}
                                        {...inputProps}
                                        value={field.value ?? ""}
                                        label="Line 2"
                                        autoComplete="billing address-line2"
                                        error={getError("address.billing.line2")}
                                        disabled={userAwaiting || cartAwaiting || billingIsDelivery}
                                    />
                                );
                            }}
                        />

                        <Controller
                            control={control}
                            name="address.billing.townCity"
                            render={({ field }) => {
                                return (
                                    <TextInput
                                        {...field}
                                        {...inputProps}
                                        value={field.value ?? ""}
                                        label="Town/City"
                                        autoComplete="billing address-level2"
                                        required
                                        error={getError("address.billing.townCity")}
                                        disabled={userAwaiting || cartAwaiting || billingIsDelivery}
                                    />
                                );
                            }}
                        />

                        <Controller
                            control={control}
                            name="address.billing.county"
                            render={({ field }) => {
                                return (
                                    <TextInput
                                        {...field}
                                        {...inputProps}
                                        value={field.value ?? ""}
                                        label="County"
                                        error={getError("address.billing.county")}
                                        disabled={userAwaiting || cartAwaiting || billingIsDelivery}
                                    />
                                );
                            }}
                        />

                        <Controller
                            control={control}
                            name="address.billing.postcode"
                            render={({ field }) => {
                                return (
                                    <TextInput
                                        {...field}
                                        {...inputProps}
                                        value={field.value ?? ""}
                                        label="Postcode"
                                        autoComplete="billing postal-code"
                                        required
                                        error={getError("address.billing.postcode")}
                                        disabled={userAwaiting || cartAwaiting || billingIsDelivery}
                                    />
                                );
                            }}
                        />
                    </div>
                </fieldset>
            </Collapse>

            <Divider className={styles["divider-light"]} />

            <Controller
                control={control}
                name="type"
                render={({ field }) => (
                    <Radio.Group
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        label="Select a shipping option"
                        classNames={{
                            root: styles["radio-group-root"],
                            label: styles["radio-group-label"],
                        }}
                    >
                        <div className={styles["radio-options-container"]}>
                            <Radio
                                value="standard"
                                label="Standard delivery"
                                classNames={radioClassNames}
                            />
                            <Radio
                                value="express"
                                label="Express delivery"
                                classNames={radioClassNames}
                            />
                        </div>
                    </Radio.Group>
                )}
            />

            <div className={styles["button-container"]}>
                <Button
                    type="button"
                    color="rgb(48, 48, 48)"
                    variant="filled"
                    radius={9999}
                    onClick={() => onReturn && onReturn()}
                    disabled={userAwaiting || cartAwaiting}
                    className={styles["previous-stage-button"]}
                >
                    Return to personal
                </Button>

                <Button
                    type="submit"
                    color="rgb(48, 48, 48)"
                    variant="filled"
                    radius={9999}
                    disabled={userAwaiting || cartAwaiting}
                    className={styles["next-stage-button"]}
                >
                    Continue to payment
                </Button>
            </div>
        </form>
    );
}
