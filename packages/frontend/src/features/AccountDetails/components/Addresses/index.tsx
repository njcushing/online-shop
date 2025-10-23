import { useCallback, useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/components/Forms/FormBuilder";
import { User } from "@/utils/schemas/user";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { AddressesFormData, addressesFormDataSchema } from "./schemas/addressSchema";
import styles from "./index.module.css";

export function Addresses() {
    const { user, defaultData } = useContext(UserContext);

    let userData = defaultData.user as User;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "user", context: user }],
    });

    if (!awaitingAny) {
        if (data.user) userData = data.user;
    }

    const { profile } = userData;
    const { addresses } = profile;
    const { delivery, billing } = addresses || {};

    const skeletonProps = useMemo(
        () => ({ visible: awaitingAny, width: "min-content" }),
        [awaitingAny],
    );

    const skeletonAddress = useCallback(
        (fields: typeof delivery | typeof billing) => {
            if (!awaitingAny || !fields) return null;
            return Object.entries(fields).map((field) => {
                const [key, value] = field;
                return (
                    <Skeleton {...skeletonProps} key={key}>
                        <div className={styles["address-line"]} style={{ visibility: "hidden" }}>
                            <div>{value}</div>
                        </div>
                    </Skeleton>
                );
            });
        },
        [awaitingAny, skeletonProps],
    );

    const deliveryAddressFullElement = useMemo(() => {
        if (awaitingAny)
            return <div className={styles["address"]}>{skeletonAddress(delivery)}</div>;
        if (!delivery) return <div className={styles["address"]}>No address set</div>;
        return (
            <div className={styles["address"]}>
                <div className={styles["address-line"]}>
                    <div>{delivery.line1}</div>
                </div>
                {delivery.line2 && delivery.line2.length > 0 && (
                    <div className={styles["address-line"]}>
                        <div>{delivery.line2}</div>
                    </div>
                )}
                <div className={styles["address-line"]}>
                    <div>{delivery.townCity}</div>
                </div>
                <div className={styles["address-line"]}>
                    <div>{delivery.county}</div>
                </div>
                <div className={styles["address-line"]}>
                    <div>{delivery.postcode}</div>
                </div>
            </div>
        );
    }, [awaitingAny, delivery, skeletonAddress]);

    const billingAddressFullElement = useMemo(() => {
        if (awaitingAny) return <div className={styles["address"]}>{skeletonAddress(billing)}</div>;
        if (!billing) return <div className={styles["no-address"]}>No address set</div>;
        return (
            <div className={styles["address"]}>
                <div className={styles["address-line"]}>
                    <div>{billing.line1}</div>
                </div>
                {billing.line2 && billing.line2.length > 0 && (
                    <div className={styles["address-line"]}>
                        <div>{billing.line2}</div>
                    </div>
                )}
                <div className={styles["address-line"]}>
                    <div>{billing.townCity}</div>
                </div>
                <div className={styles["address-line"]}>
                    <div>{billing.county}</div>
                </div>
                <div className={styles["address-line"]}>
                    <div>{billing.postcode}</div>
                </div>
            </div>
        );
    }, [awaitingAny, billing, skeletonAddress]);

    return (
        <div className={styles["account-settings-content"]}>
            <h1 className={styles["header"]}>Addresses</h1>

            <div className={styles["forms-container"]}>
                <FormBuilder<AddressesFormData>
                    fieldsets={[
                        {
                            legend: "Delivery Address",
                            fields: [
                                {
                                    type: "text",
                                    name: "addresses.delivery.line1",
                                    label: "Line 1",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.delivery.line2",
                                    label: "Line 2",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.delivery.townCity",
                                    label: "Town or City",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.delivery.county",
                                    label: "County",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.delivery.postcode",
                                    label: "Postcode",
                                    mode: "onTouched",
                                },
                            ],
                            fullElement: deliveryAddressFullElement,
                        },
                    ]}
                    ariaLabel="Delivery Address"
                    defaultValues={{
                        addresses: {
                            delivery: {
                                line1: delivery?.line1 || "",
                                line2: delivery?.line2 || "",
                                townCity: delivery?.townCity || "",
                                county: delivery?.county || "",
                                postcode: delivery?.postcode || "",
                            },
                        },
                    }}
                    resolver={zodResolver(addressesFormDataSchema)}
                    disabled={awaitingAny}
                />

                <FormBuilder<AddressesFormData>
                    fieldsets={[
                        {
                            legend: "Billing Address",
                            fields: [
                                {
                                    type: "text",
                                    name: "addresses.billing.line1",
                                    label: "Line 1",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.billing.line2",
                                    label: "Line 2",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.billing.townCity",
                                    label: "Town or City",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.billing.county",
                                    label: "County",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "addresses.billing.postcode",
                                    label: "Postcode",
                                    mode: "onTouched",
                                },
                            ],
                            fullElement: billingAddressFullElement,
                        },
                    ]}
                    ariaLabel="Billing Address"
                    defaultValues={{
                        addresses: {
                            billing: {
                                line1: billing?.line1 || "",
                                line2: billing?.line2 || "",
                                townCity: billing?.townCity || "",
                                county: billing?.county || "",
                                postcode: billing?.postcode || "",
                            },
                        },
                    }}
                    resolver={zodResolver(addressesFormDataSchema)}
                    disabled={awaitingAny}
                />
            </div>
        </div>
    );
}
