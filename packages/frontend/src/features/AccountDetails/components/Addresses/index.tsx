import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/features/AccountDetails/components/FormBuilder";
import { AddressFormData, addressFormDataSchema } from "./schemas/addressSchema";
import styles from "./index.module.css";

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function Addresses() {
    const { accountDetails, defaultData } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { addresses } = data || {};
    const { delivery, billing } = addresses || {};
    const {
        line1: dLine1,
        line2: dLine2,
        townCity: dTownCity,
        county: dCounty,
        postcode: dPostcode,
    } = delivery || {};
    const {
        line1: bLine1,
        line2: bLine2,
        townCity: bTownCity,
        county: bCounty,
        postcode: bPostcode,
    } = billing || {};

    const { accountDetails: defaultAccountDetails } = defaultData;
    const { addresses: defaultAddresses } = defaultAccountDetails;
    const { delivery: defaultD, billing: defaultB } = defaultAddresses;

    const skeletonProps = {
        visible: awaiting,
        classNames: SkeletonClassNames,
        width: "min-content",
    };

    return (
        <div className={styles["forms-container"]}>
            <h1 className={styles["header"]}>Addresses</h1>

            <FormBuilder<AddressFormData>
                fieldsets={[
                    {
                        legend: "Delivery Address",
                        fields: [
                            {
                                type: "text",
                                name: "address.line1",
                                label: "Line 1",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.line2",
                                label: "Line 2",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.townCity",
                                label: "Town or City",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.county",
                                label: "County",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.postcode",
                                label: "Postcode",
                                mode: "onTouched",
                            },
                        ],
                        fullElement: (
                            <div className={styles["address"]}>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>{awaiting ? `${defaultD.line1}` : `${dLine1}`}</div>
                                    </div>
                                </Skeleton>
                                {(awaiting || (dLine2 && dLine2.length > 0)) && (
                                    <Skeleton {...skeletonProps}>
                                        <div
                                            className={styles["address-line"]}
                                            style={{
                                                visibility: awaiting ? "hidden" : "initial",
                                            }}
                                        >
                                            <div>
                                                {awaiting ? `${defaultD.line2}` : `${dLine2}`}
                                            </div>
                                        </div>
                                    </Skeleton>
                                )}
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>
                                            {awaiting ? `${defaultD.townCity}` : `${dTownCity}`}
                                        </div>
                                    </div>
                                </Skeleton>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>{awaiting ? `${defaultD.county}` : `${dCounty}`}</div>
                                    </div>
                                </Skeleton>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>
                                            {awaiting ? `${defaultD.postcode}` : `${dPostcode}`}
                                        </div>
                                    </div>
                                </Skeleton>
                            </div>
                        ),
                    },
                ]}
                ariaLabel="Delivery Address"
                defaultValues={{
                    address: {
                        line1: dLine1 || "",
                        line2: dLine2 || "",
                        townCity: dTownCity || "",
                        county: dCounty || "",
                        postcode: dPostcode || "",
                    },
                }}
                resolver={zodResolver(addressFormDataSchema)}
                disabled={awaiting}
            />

            <FormBuilder<AddressFormData>
                fieldsets={[
                    {
                        legend: "Billing Address",
                        fields: [
                            {
                                type: "text",
                                name: "address.line1",
                                label: "Line 1",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.line2",
                                label: "Line 2",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.townCity",
                                label: "Town or City",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.county",
                                label: "County",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "address.postcode",
                                label: "Postcode",
                                mode: "onTouched",
                            },
                        ],
                        fullElement: (
                            <div className={styles["address"]}>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>{awaiting ? `${defaultB.line1}` : `${bLine1}`}</div>
                                    </div>
                                </Skeleton>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>{awaiting ? `${defaultB.line2}` : `${bLine2}`}</div>
                                    </div>
                                </Skeleton>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>
                                            {awaiting ? `${defaultB.townCity}` : `${bTownCity}`}
                                        </div>
                                    </div>
                                </Skeleton>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>{awaiting ? `${defaultB.county}` : `${bCounty}`}</div>
                                    </div>
                                </Skeleton>
                                <Skeleton {...skeletonProps}>
                                    <div
                                        className={styles["address-line"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        <div>
                                            {awaiting ? `${defaultB.postcode}` : `${bPostcode}`}
                                        </div>
                                    </div>
                                </Skeleton>
                            </div>
                        ),
                    },
                ]}
                ariaLabel="Billing Address"
                defaultValues={{
                    address: {
                        line1: bLine1 || "",
                        line2: bLine2 || "",
                        townCity: bTownCity || "",
                        county: bCounty || "",
                        postcode: bPostcode || "",
                    },
                }}
                resolver={zodResolver(addressFormDataSchema)}
                disabled={awaiting}
            />
        </div>
    );
}
