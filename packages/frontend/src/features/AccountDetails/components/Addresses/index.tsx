import { useContext, useMemo } from "react";
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
                        fullElement: awaiting ? (
                            skeletonAddress
                        ) : (
                            <div className={styles["address"]}>
                                <div className={styles["address-line"]}>
                                    <div>{dLine1}</div>
                                </div>
                                {dLine2 && dLine2.length > 0 && (
                                    <div className={styles["address-line"]}>
                                        <div>{dLine2}</div>
                                    </div>
                                )}
                                <div className={styles["address-line"]}>
                                    <div>{dTownCity}</div>
                                </div>
                                <div className={styles["address-line"]}>
                                    <div>{dCounty}</div>
                                </div>
                                <div className={styles["address-line"]}>
                                    <div>{dPostcode}</div>
                                </div>
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
                        fullElement: awaiting ? (
                            skeletonAddress
                        ) : (
                            <div className={styles["address"]}>
                                <div className={styles["address-line"]}>
                                    <div>{bLine1}</div>
                                </div>
                                {bLine2 && bLine2.length > 0 && (
                                    <div className={styles["address-line"]}>
                                        <div>{bLine2}</div>
                                    </div>
                                )}
                                <div className={styles["address-line"]}>
                                    <div>{bTownCity}</div>
                                </div>
                                <div className={styles["address-line"]}>
                                    <div>{bCounty}</div>
                                </div>
                                <div className={styles["address-line"]}>
                                    <div>{bPostcode}</div>
                                </div>
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
