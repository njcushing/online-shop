import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { Names } from "./forms/Names";
import { PhoneNumber } from "./forms/PhoneNumber";
import { FormBuilder } from "./forms/FormBuilder";
import { Email } from "./forms/Email";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./schemas/dateOfBirthSchema";
import styles from "./index.module.css";

export function PersonalInformation() {
    const { accountDetails } = useContext(UserContext);
    const { data } = accountDetails;

    const { personal } = data || {};
    const { dob } = personal || {};

    return (
        <div className={styles["forms-container"]}>
            <h1 className={styles["header"]}>Personal Information</h1>

            <Names />
            <PhoneNumber />
            <FormBuilder<DateOfBirthFormData>
                fields={[
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
                ]}
                ariaLabel="Date of birth"
                defaultValues={dob as DateOfBirthFormData}
                resolver={zodResolver(dateOfBirthFormDataSchema)}
                additionalErrorPaths={["dob.root"]}
            />
            <Email />
        </div>
    );
}
