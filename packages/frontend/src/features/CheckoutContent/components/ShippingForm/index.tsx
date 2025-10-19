import { useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CheckoutShippingOption,
    CheckoutShippingFormData,
    checkoutShippingFormDataSchema,
} from "@/utils/schemas/checkout";
import { useForm, useWatch, Controller, SubmitHandler } from "react-hook-form";
import { Collapse, TextInput, Divider, Checkbox, Radio, Button, Skeleton } from "@mantine/core";
import { NumberCircleTwo } from "@phosphor-icons/react";
import { Error as InputError } from "@/components/UI/Error";
import { calculateCartSubtotal } from "@/utils/products/utils/calculateCartSubtotal";
import _ from "lodash";
import dayjs from "dayjs";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export type TShippingForm = {
    isOpen: boolean;
    onReturn?: () => void;
    onSubmit?: SubmitHandler<CheckoutShippingFormData>;
};

export function ShippingForm({ isOpen = false, onReturn, onSubmit }: TShippingForm) {
    const { settings } = useContext(RootContext);
    const { user, cart, shipping } = useContext(UserContext);

    const { response: settingsResponse, awaiting: settingsAwaiting } = settings;
    const { response: userResponse, awaiting: userAwaiting } = user;
    const { response: cartResponse, awaiting: cartAwaiting } = cart;

    const { success: settingsSuccess } = settingsResponse;
    const { success: userSuccess } = userResponse;
    const { success: cartSuccess } = cartResponse;

    const awaitingAny = settingsAwaiting || userAwaiting || cartAwaiting;

    let settingsData = null;
    let userData = null;
    let cartData = null;

    if (!awaitingAny) {
        if (!settingsSuccess) throw new Error(settingsResponse.message);
        if (!userSuccess) throw new Error(userResponse.message);
        if (!cartSuccess) throw new Error(cartResponse.message);

        settingsData = settingsResponse.data;
        userData = userResponse.data;
        cartData = cartResponse.data;
    }

    const { value: selectedShipping, setter: setShipping } = shipping;

    const defaultValues = useMemo(() => {
        const delivery = userData?.profile?.addresses?.delivery;
        const billing = userData?.profile?.addresses?.billing;

        return {
            address: {
                delivery: {
                    line1: delivery?.line1 || "",
                    line2: delivery?.line2 || "",
                    townCity: delivery?.townCity || "",
                    county: delivery?.county || "",
                    postcode: delivery?.postcode || "",
                },
                billing: {
                    line1: billing?.line1 || "",
                    line2: billing?.line2 || "",
                    townCity: billing?.townCity || "",
                    county: billing?.county || "",
                    postcode: billing?.postcode || "",
                },
            },
            type: selectedShipping,
        };
    }, [userData, selectedShipping]);

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
            return <InputError message={typeof fieldError === "string" ? fieldError : ""} />;
        },
        [errors],
    );

    const [billingIsDelivery, setBillingIsDelivery] = useState<boolean>(true);
    const currentDeliveryValues = useWatch({ control, name: "address.delivery" });
    const cachedBilling = useRef<CheckoutShippingFormData["address"]["billing"]>(
        defaultValues.address.billing,
    );
    useEffect(() => {
        if (billingIsDelivery) {
            cachedBilling.current = getValues("address.billing");
            setValue("address.billing", currentDeliveryValues, { shouldValidate: true });
        } else {
            setValue("address.billing", cachedBilling.current);
        }
    }, [getValues, setValue, billingIsDelivery, currentDeliveryValues]);

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

    const deliveryAddressFields = useMemo(() => {
        return (
            <div className={styles["fields-container"]}>
                <Controller
                    control={control}
                    name="address.delivery.line1"
                    render={({ field }) => {
                        return (
                            <TextInput
                                {...field}
                                {...inputProps}
                                value={field.value}
                                label="Line 1"
                                autoComplete="delivery address-line1"
                                required
                                error={getError("address.delivery.line1")}
                                disabled={disableInputs}
                                ref={firstInputRef}
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
                                value={field.value}
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
                                value={field.value}
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
                                value={field.value}
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
                                value={field.value}
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
        );
    }, [control, disableInputs, getError]);

    const billingAddressFields = useMemo(() => {
        return (
            <div className={styles["fields-container"]}>
                <Controller
                    control={control}
                    name="address.billing.line1"
                    render={({ field }) => {
                        return (
                            <TextInput
                                {...field}
                                {...inputProps}
                                value={field.value}
                                label="Line 1"
                                autoComplete="billing address-line1"
                                required
                                error={getError("address.billing.line1")}
                                disabled={disableInputs || billingIsDelivery}
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
                                value={field.value}
                                label="Line 2"
                                autoComplete="billing address-line2"
                                error={getError("address.billing.line2")}
                                disabled={disableInputs || billingIsDelivery}
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
                                value={field.value}
                                label="Town/City"
                                autoComplete="billing address-level2"
                                required
                                error={getError("address.billing.townCity")}
                                disabled={disableInputs || billingIsDelivery}
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
                                value={field.value}
                                label="County"
                                error={getError("address.billing.county")}
                                disabled={disableInputs || billingIsDelivery}
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
                                value={field.value}
                                label="Postcode"
                                autoComplete="billing postal-code"
                                required
                                error={getError("address.billing.postcode")}
                                disabled={disableInputs || billingIsDelivery}
                            />
                        );
                    }}
                />
            </div>
        );
    }, [control, disableInputs, getError, billingIsDelivery]);

    const shippingOption = useMemo(() => {
        const { baseExpressDeliveryCost, freeExpressDeliveryThreshold } = settingsData || {
            baseExpressDeliveryCost: 0,
            freeExpressDeliveryThreshold: 0,
        };
        const cartSubtotal = cartData ? calculateCartSubtotal(cartData) : null;
        let postageCost = 0;
        if (cartSubtotal) {
            const { total } = cartSubtotal.cost;
            postageCost = total >= freeExpressDeliveryThreshold ? 0 : baseExpressDeliveryCost;
        }

        return (
            <Controller
                control={control}
                name="type"
                render={({ field }) => (
                    <Radio.Group
                        {...field}
                        value={field.value}
                        onChange={(value) => {
                            field.onChange(value);
                            setShipping(value as CheckoutShippingOption);
                        }}
                        label="Select a shipping option"
                        required
                        error={getError("type")}
                        classNames={{
                            root: styles["radio-group-root"],
                            label: styles["radio-group-label"],
                        }}
                    >
                        <div className={styles["radio-options-container"]}>
                            <Radio.Card value="standard" className={styles["radio-card"]}>
                                <Radio.Indicator
                                    disabled={disableInputs}
                                    className={styles["radio-indicator"]}
                                />
                                <div className={styles["radio-card-right"]}>
                                    <Skeleton visible={awaitingAny}>
                                        <span
                                            className={styles["radio-label"]}
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        >
                                            Standard delivery <strong>(FREE)</strong>
                                        </span>
                                    </Skeleton>
                                    <span className={styles["radio-description"]}>
                                        <Skeleton visible={awaitingAny}>
                                            <span
                                                className={styles["radio-description-main"]}
                                                style={{
                                                    visibility: awaitingAny ? "hidden" : "initial",
                                                }}
                                            >
                                                We aim to ship all orders within 48h of time of
                                                purchase; this is guaranteed if the order is placed
                                                before 5pm.
                                            </span>
                                        </Skeleton>
                                        <Skeleton visible={awaitingAny}>
                                            <span
                                                className={
                                                    styles["radio-description-expected-date"]
                                                }
                                                style={{
                                                    visibility: awaitingAny ? "hidden" : "initial",
                                                }}
                                            >
                                                Expected delivery date:{" "}
                                                {dayjs(expectedDeliveryDate.standard).format(
                                                    "MMMM D, YYYY",
                                                )}
                                            </span>
                                        </Skeleton>
                                    </span>
                                </div>
                            </Radio.Card>
                            <Radio.Card value="express" className={styles["radio-card"]}>
                                <Radio.Indicator
                                    disabled={disableInputs}
                                    className={styles["radio-indicator"]}
                                />
                                <div className={styles["radio-card-right"]}>
                                    <Skeleton visible={awaitingAny}>
                                        <span
                                            className={styles["radio-label"]}
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        >
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
                                    </Skeleton>
                                    <span className={styles["radio-description"]}>
                                        <Skeleton visible={awaitingAny}>
                                            <span
                                                className={styles["radio-description-main"]}
                                                style={{
                                                    visibility: awaitingAny ? "hidden" : "initial",
                                                }}
                                            >
                                                We aim to ship all orders within 48h of time of
                                                purchase; this is guaranteed if the order is placed
                                                before 5pm.
                                            </span>
                                        </Skeleton>
                                        <Skeleton visible={awaitingAny}>
                                            <span
                                                className={
                                                    styles["radio-description-expected-date"]
                                                }
                                                style={{
                                                    visibility: awaitingAny ? "hidden" : "initial",
                                                }}
                                            >
                                                Expected delivery date:{" "}
                                                {dayjs(expectedDeliveryDate.express).format(
                                                    "MMMM D, YYYY",
                                                )}
                                            </span>
                                        </Skeleton>
                                    </span>
                                </div>
                            </Radio.Card>
                        </div>
                    </Radio.Group>
                )}
            />
        );
    }, [
        awaitingAny,
        settingsData,
        cartData,
        control,
        disableInputs,
        expectedDeliveryDate,
        getError,
        setShipping,
    ]);

    return (
        <div className={styles["checkout-details-section"]} ref={containerRef}>
            <div className={styles["panel"]}>
                <NumberCircleTwo weight="fill" size="2rem" />
                <span className={styles["panel-title"]}>Shipping</span>
            </div>
            <Collapse in={isOpen} animateOpacity={false} onTransitionEnd={() => focusFirstInput()}>
                <div className={styles["checkout-details-section-content"]}>
                    <form
                        className={styles["form"]}
                        aria-label="checkout shipping"
                        onSubmit={onSubmit && handleSubmit(onSubmit)}
                        noValidate
                    >
                        <fieldset className={styles["fieldset"]}>
                            <legend className={styles["legend"]}>Delivery address</legend>

                            {deliveryAddressFields}
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
                            <fieldset
                                className={styles["fieldset"]}
                                data-matches-delivery={billingIsDelivery}
                            >
                                <legend className={styles["legend"]}>Billing address</legend>

                                {billingAddressFields}
                            </fieldset>
                        </Collapse>

                        <Divider className={styles["divider-light"]} />

                        {shippingOption}

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
                </div>
            </Collapse>
        </div>
    );
}
