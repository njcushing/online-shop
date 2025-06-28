import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { Names } from "./forms/Names";
import { PhoneNumber } from "./forms/PhoneNumber";
import { DateOfBirth } from "./forms/DateOfBirth";
import { Email } from "./forms/Email";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./forms/DateOfBirth/zodSchema";
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
            <DateOfBirth<DateOfBirthFormData>
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
                defaultValues={dob as DateOfBirthFormData}
                resolver={zodResolver(dateOfBirthFormDataSchema)}
                additionalErrorPaths={["dob.root"]}
            />
            <Email />
        </div>
    );
}
