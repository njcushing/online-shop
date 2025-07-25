import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton } from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/features/AccountDetails/components/FormBuilder";
import dayjs from "dayjs";
import { NamesFormData, namesFormDataSchema } from "./schemas/namesSchema";
import { PhoneNumberFormData, phoneNumberFormDataSchema } from "./schemas/phoneNumberSchema";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./schemas/dateOfBirthSchema";
import { EmailFormData, emailFormDataSchema } from "./schemas/emailSchema";
import styles from "./index.module.css";

export function PersonalInformation() {
    const { accountDetails, defaultData } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { personal } = data || {};
    const { firstName, lastName, phone, dob, email } = personal || {};
    const { day, month, year } = dob || {};

    const nameFullElement = useMemo(() => {
        if (awaiting) {
            return `${defaultData.accountDetails.personal.firstName} ${defaultData.accountDetails.personal.lastName}`;
        }
        if (firstName && firstName.length > 0 && lastName && lastName.length > 0) {
            return `${firstName} ${lastName}`;
        }
        return "Provide a name";
    }, [awaiting, defaultData, firstName, lastName]);

    const phoneFullElement = useMemo(() => {
        if (awaiting) {
            return defaultData.accountDetails.personal.phone;
        }
        if (phone && phone.length > 0) {
            return phone;
        }
        return "Provide a phone number";
    }, [awaiting, defaultData, phone]);

    const emailFullElement = useMemo(() => {
        if (awaiting) {
            return defaultData.accountDetails.personal.email;
        }
        if (email && email.length > 0) {
            return email;
        }
        return "Provide an email address";
    }, [awaiting, defaultData, email]);

    return (
        <div className={styles["account-settings-content"]}>
            <h1 className={styles["header"]}>Personal Information</h1>

            <div className={styles["forms-container"]}>
                <FormBuilder<NamesFormData>
                    fieldsets={[
                        {
                            legend: "Name",
                            fields: [
                                {
                                    type: "text",
                                    name: "personal.firstName",
                                    label: "First name",
                                    mode: "onTouched",
                                },
                                {
                                    type: "text",
                                    name: "personal.lastName",
                                    label: "Last name",
                                    mode: "onTouched",
                                },
                            ],
                            fullElement: (
                                <Skeleton visible={awaiting} width="min-content">
                                    <div
                                        className={styles["full-name"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        {nameFullElement}
                                    </div>
                                </Skeleton>
                            ),
                        },
                    ]}
                    ariaLabel="Name"
                    defaultValues={{
                        personal: { firstName: firstName || "", lastName: lastName || "" },
                    }}
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
                                    name: "personal.phone",
                                    label: "Phone number",
                                    mode: "onTouched",
                                },
                            ],
                            fullElement: (
                                <Skeleton visible={awaiting} width="min-content">
                                    <div
                                        className={styles["phone-number"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        {phoneFullElement}
                                    </div>
                                </Skeleton>
                            ),
                        },
                    ]}
                    ariaLabel="Phone number"
                    defaultValues={{ personal: { phone: phone || "" } }}
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
                                    name: "personal.dob.day",
                                    label: "Day",
                                    mode: "onTouched",
                                    validateOther: ["dob.root"],
                                    sharedValidation: ["dob.root"],
                                },
                                {
                                    type: "numeric",
                                    name: "personal.dob.month",
                                    label: "Month",
                                    mode: "onTouched",
                                    validateOther: ["dob.root"],
                                    sharedValidation: ["dob.root"],
                                },
                                {
                                    type: "numeric",
                                    name: "personal.dob.year",
                                    label: "Year",
                                    mode: "onTouched",
                                    validateOther: ["dob.root"],
                                    sharedValidation: ["dob.root"],
                                },
                            ],
                            fullElement: (
                                <Skeleton visible={awaiting} width="min-content">
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
                    defaultValues={{ personal: { dob } }}
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
                                    name: "personal.email",
                                    label: "Email address",
                                    mode: "onTouched",
                                },
                            ],
                            fullElement: (
                                <Skeleton visible={awaiting} width="min-content">
                                    <div
                                        className={styles["email-address"]}
                                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                                    >
                                        {emailFullElement}
                                    </div>
                                </Skeleton>
                            ),
                        },
                    ]}
                    ariaLabel="Email"
                    defaultValues={{ personal: { email: email || "" } }}
                    resolver={zodResolver(emailFormDataSchema)}
                    disabled={awaiting}
                />
            </div>
        </div>
    );
}
