import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/features/AccountDetails/components/FormBuilder";
import { AddressesFormData, addressesFormDataSchema } from "./schemas/addressSchema";
import styles from "./index.module.css";

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function Addresses() {
    const { accountDetails, defaultData } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { addresses } = data || {};
    const { delivery, billing } = addresses || {};

    const { accountDetails: defaultAccountDetails } = defaultData;
    const { addresses: defaultAddresses } = defaultAccountDetails;
    const { delivery: defaultD } = defaultAddresses;

    const skeletonProps = useMemo(
        () => ({
            visible: awaiting,
            classNames: SkeletonClassNames,
            width: "min-content",
        }),
        [awaiting],
    );

    const skeletonAddress = useMemo(() => {
        const fields = ["line1", "line2", "townCity", "county", "postcode"];

        return fields.map((field) => (
            <Skeleton {...skeletonProps} key={field}>
                <div
                    className={styles["address-line"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    <div>{defaultD[field as keyof typeof defaultD]}</div>
                </div>
            </Skeleton>
        ));
    }, [awaiting, defaultD, skeletonProps]);

    const deliveryAddressFullElement = useMemo(() => {
        if (awaiting) return <div className={styles["address"]}>{skeletonAddress}</div>;
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
    }, [awaiting, delivery, skeletonAddress]);

    const billingAddressFullElement = useMemo(() => {
        if (awaiting) return <div className={styles["address"]}>{skeletonAddress}</div>;
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
    }, [awaiting, billing, skeletonAddress]);

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
                    disabled={awaiting}
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
                    disabled={awaiting}
                />
            </div>
        </div>
    );
}
