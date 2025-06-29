import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/features/AccountDetails/components/FormBuilder";
import { NamesFormData, namesFormDataSchema } from "./schemas/namesSchema";
import { PhoneNumberFormData, phoneNumberFormDataSchema } from "./schemas/phoneNumberSchema";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./schemas/dateOfBirthSchema";
import { EmailFormData, emailFormDataSchema } from "./schemas/emailSchema";
import styles from "./index.module.css";

export function PersonalInformation() {
    const { accountDetails } = useContext(UserContext);
    const { data } = accountDetails;

    const { personal } = data || {};
    const { firstName, lastName, phone, dob, email } = personal || {};

    return (
        <div className={styles["forms-container"]}>
            <h1 className={styles["header"]}>Personal Information</h1>

            <FormBuilder<NamesFormData>
                fieldsets={[
                    {
                        legend: "Names",
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
                    },
                ]}
                ariaLabel="Name"
                defaultValues={{ firstName: firstName || "", lastName: lastName || "" }}
                resolver={zodResolver(namesFormDataSchema)}
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
                    },
                ]}
                ariaLabel="Name"
                defaultValues={{ phone: phone || "" }}
                resolver={zodResolver(phoneNumberFormDataSchema)}
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
                    },
                ]}
                ariaLabel="Date of birth"
                defaultValues={dob as DateOfBirthFormData}
                resolver={zodResolver(dateOfBirthFormDataSchema)}
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
                    },
                ]}
                ariaLabel="Email"
                defaultValues={{ email: email || "" }}
                resolver={zodResolver(emailFormDataSchema)}
            />
        </div>
    );
}
