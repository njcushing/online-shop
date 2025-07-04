import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/features/AccountDetails/components/FormBuilder";
import { PasswordsFormData, passwordsFormDataSchema } from "./schemas/passwordsSchema";
import styles from "./index.module.css";

export function Security() {
    const { accountDetails } = useContext(UserContext);
    const { awaiting } = accountDetails;

    return (
        <div className={styles["account-settings-content"]}>
            <h1 className={styles["header"]}>Security</h1>

            <div className={styles["forms-container"]}>
                <FormBuilder<PasswordsFormData>
                    fieldsets={[
                        {
                            legend: "Password",
                            fields: [
                                {
                                    type: "text",
                                    name: "newPassword",
                                    label: "New password",
                                    mode: "onTouched",
                                    validateOther: ["root"],
                                    sharedValidation: ["root"],
                                },
                                {
                                    type: "text",
                                    name: "confirmNewPassword",
                                    label: "Confirm new password",
                                    mode: "onTouched",
                                    validateOther: ["root"],
                                    sharedValidation: ["root"],
                                },
                            ],
                            fullElement: (
                                <div className={styles["update-password-message"]}>
                                    Update your password
                                </div>
                            ),
                        },
                    ]}
                    ariaLabel="Password"
                    defaultValues={{ newPassword: "", confirmNewPassword: "" }}
                    resolver={zodResolver(passwordsFormDataSchema)}
                    disabled={awaiting}
                    additionalErrorPaths={["root"]}
                />
            </div>
        </div>
    );
}
