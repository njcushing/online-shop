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
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import _ from "lodash";
import dayjs from "dayjs";
import { settings } from "@settings";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

const radioClassNames: RadioProps["classNames"] = {
    root: styles["radio-root"],
    radio: styles["radio"],
    body: styles["radio-body"],
    label: styles["radio-label"],
    description: styles["radio-description"],
};

export type TShipping = {
    isOpen?: boolean;
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

export function ShippingForm({ isOpen, onReturn, onSubmit }: TShipping) {
    const { user, cart } = useContext(UserContext);

    const { response: userResponse, awaiting: userAwaiting } = user;
    const { data: userData } = userResponse;
    const { profile } = userData || {};
    const { addresses } = profile || {};
    const { delivery } = addresses || {};
    const {
        line1: dLine1,
        line2: dLine2,
        townCity: dTownCity,
        county: dCounty,
        postcode: dPostcode,
    } = delivery || {};

    const { response: cartResponse, awaiting: cartAwaiting } = cart;
    const { data: cartData } = cartResponse;

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

    const cartSubtotal = cartData ? calculateCartSubtotal(cartData) : null;
    const postageCost = cartSubtotal ? cartSubtotal.cost.postage : settings.expressDeliveryCost;

    const fivePmTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isPastFivePm, setIsPastFivePm] = useState<boolean>(false);
    useEffect(() => {
        const currentDate = new Date();
        const fivePm = new Date();
        fivePm.setHours(17, 0, 0, 0);

        const timeUntilFivePm = fivePm.getTime() - currentDate.getTime();

        if (timeUntilFivePm > 0) {
            fivePmTimeout.current = setTimeout(() => setIsPastFivePm(true), timeUntilFivePm);
        } else {
            setIsPastFivePm(true);
        }

        return () => {
            if (fivePmTimeout.current) clearTimeout(fivePmTimeout.current);
        };
    }, []);

    const expectedDeliveryDate = useMemo(() => {
        return {
            standard: new Date().setDate(new Date().getDate() + (isPastFivePm ? 3 : 2)),
            express: new Date().setDate(new Date().getDate() + (isPastFivePm ? 2 : 1)),
        };
    }, [isPastFivePm]);

    const disableInputs = userAwaiting || cartAwaiting || !isOpen;

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
                                    disabled={disableInputs}
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
                                    disabled={disableInputs}
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
                                    disabled={disableInputs}
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
                                    disabled={disableInputs}
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
                                    disabled={disableInputs}
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
                <fieldset className={styles["fieldset"]} data-matches-delivery={billingIsDelivery}>
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
                                label={
                                    <span>
                                        Standard delivery <strong>(FREE)</strong>
                                    </span>
                                }
                                description={
                                    <span className={styles["radio-description"]}>
                                        <span className={styles["radio-description-main"]}>
                                            We aim to ship all orders within 48h of time of
                                            purchase; this is guaranteed if the order is placed
                                            before 5pm.
                                        </span>
                                        <span className={styles["radio-description-expected-date"]}>
                                            Expected delivery date:{" "}
                                            {dayjs(expectedDeliveryDate.standard).format(
                                                "MMMM D, YYYY",
                                            )}
                                        </span>
                                    </span>
                                }
                                disabled={disableInputs}
                                classNames={radioClassNames}
                            />
                            <Radio
                                value="express"
                                label={
                                    <span>
                                        Express delivery{" "}
                                        {postageCost > 0 ? (
                                            <>
                                                {"- "}
                                                <strong>
                                                    {`£${(postageCost / 100).toFixed(2)}`}
                                                </strong>
                                            </>
                                        ) : (
                                            <strong>(FREE)</strong>
                                        )}
                                    </span>
                                }
                                description={
                                    <span className={styles["radio-description"]}>
                                        <span className={styles["radio-description-main"]}>
                                            Guaranteed next-day delivery on all orders if placed
                                            before 5pm.
                                        </span>
                                        <span className={styles["radio-description-expected-date"]}>
                                            Expected delivery date:{" "}
                                            {dayjs(expectedDeliveryDate.express).format(
                                                "MMMM D, YYYY",
                                            )}
                                        </span>
                                    </span>
                                }
                                disabled={disableInputs}
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
                    disabled={disableInputs}
                    className={styles["previous-stage-button"]}
                >
                    Return to personal
                </Button>

                <Button
                    type="submit"
                    color="rgb(48, 48, 48)"
                    variant="filled"
                    radius={9999}
                    disabled={disableInputs}
                    className={styles["next-stage-button"]}
                >
                    Continue to payment
                </Button>
            </div>
        </form>
    );
}
