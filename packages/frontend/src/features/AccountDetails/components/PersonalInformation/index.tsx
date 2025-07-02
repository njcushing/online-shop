import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/features/AccountDetails/components/FormBuilder";
import dayjs from "dayjs";
import { NamesFormData, namesFormDataSchema } from "./schemas/namesSchema";
import { PhoneNumberFormData, phoneNumberFormDataSchema } from "./schemas/phoneNumberSchema";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./schemas/dateOfBirthSchema";
import { EmailFormData, emailFormDataSchema } from "./schemas/emailSchema";
import styles from "./index.module.css";

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function PersonalInformation() {
    const { accountDetails, defaultData } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { personal } = data || {};
    const { firstName, lastName, phone, dob, email } = personal || {};
    const { day, month, year } = dob || {};

    return (
        <div className={styles["forms-container"]}>
            <h1 className={styles["header"]}>Personal Information</h1>

            <FormBuilder<NamesFormData>
                fieldsets={[
                    {
                        legend: "Name",
                        fields: [
                            {
                                type: "text",
                                name: "firstName",
                                label: "First name",
                                mode: "onTouched",
                            },
                            {
                                type: "text",
                                name: "lastName",
                                label: "Last name",
                                mode: "onTouched",
                            },
                        ],
                        fullElement: (
                            <Skeleton
                                visible={awaiting}
                                classNames={SkeletonClassNames}
                                width="min-content"
                            >
                                <div
                                    className={styles["full-name"]}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    {awaiting
                                        ? `
                                            ${defaultData.accountDetails.personal.firstName}
                                            ${defaultData.accountDetails.personal.lastName}
                                        `
                                        : `${firstName || ""} ${lastName || ""}`}
                                </div>
                            </Skeleton>
                        ),
                    },
                ]}
                ariaLabel="Name"
                defaultValues={{ firstName: firstName || "", lastName: lastName || "" }}
                resolver={zodResolver(namesFormDataSchema)}
                disabled={awaiting}
            />

            <FormBuilder<PhoneNumberFormData>
                fieldsets={[
                    {
                        legend: "Phone number",
                        fields: [
                            {
                                type: "text",
                                name: "phone",
                                label: "Phone number",
                                mode: "onTouched",
                            },
                        ],
                        fullElement: (
                            <Skeleton
                                visible={awaiting}
                                classNames={SkeletonClassNames}
                                width="min-content"
                            >
                                <div
                                    className={styles["phone-number"]}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    {awaiting
                                        ? `${defaultData.accountDetails.personal.phone}`
                                        : `${phone || ""}`}
                                </div>
                            </Skeleton>
                        ),
                    },
                ]}
                ariaLabel="Phone number"
                defaultValues={{ phone: phone || "" }}
                resolver={zodResolver(phoneNumberFormDataSchema)}
                disabled={awaiting}
            />

            <FormBuilder<DateOfBirthFormData>
                fieldsets={[
                    {
                        legend: "Date of birth",
                        fields: [
                            {
                                type: "numeric",
                                name: "dob.day",
                                label: "Day",
                                mode: "onTouched",
                                validateOther: ["dob.root"],
                                sharedValidation: ["dob.root"],
                            },
                            {
                                type: "numeric",
                                name: "dob.month",
                                label: "Month",
                                mode: "onTouched",
                                validateOther: ["dob.root"],
                                sharedValidation: ["dob.root"],
                            },
                            {
                                type: "numeric",
                                name: "dob.year",
                                label: "Year",
                                mode: "onTouched",
                                validateOther: ["dob.root"],
                                sharedValidation: ["dob.root"],
                            },
                        ],
                        fullElement: (
                            <Skeleton
                                visible={awaiting}
                                classNames={SkeletonClassNames}
                                width="min-content"
                            >
                                <div
                                    className={styles["date-of-birth"]}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    {awaiting
                                        ? `${dayjs(`
                                                ${defaultData.accountDetails.personal.dob.year},
                                                ${defaultData.accountDetails.personal.dob.month},
                                                ${defaultData.accountDetails.personal.dob.day}
                                            `).format("MMMM D, YYYY")}`
                                        : `${dayjs(`${year}, ${month}, ${day}`).format("MMMM D, YYYY")}`}
                                </div>
                            </Skeleton>
                        ),
                    },
                ]}
                ariaLabel="Date of birth"
                defaultValues={dob as DateOfBirthFormData}
                resolver={zodResolver(dateOfBirthFormDataSchema)}
                disabled={awaiting}
                additionalErrorPaths={["dob.root"]}
            />

            <FormBuilder<EmailFormData>
                fieldsets={[
                    {
                        legend: "Email",
                        fields: [
                            {
                                type: "text",
                                name: "email",
                                label: "Email address",
                                mode: "onTouched",
                            },
                        ],
                        fullElement: (
                            <Skeleton
                                visible={awaiting}
                                classNames={SkeletonClassNames}
                                width="min-content"
                            >
                                <div
                                    className={styles["email-address"]}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    {awaiting
                                        ? `${defaultData.accountDetails.personal.email}`
                                        : `${email || ""}`}
                                </div>
                            </Skeleton>
                        ),
                    },
                ]}
                ariaLabel="Email"
                defaultValues={{ email: email || "" }}
                resolver={zodResolver(emailFormDataSchema)}
                disabled={awaiting}
            />
        </div>
    );
}
