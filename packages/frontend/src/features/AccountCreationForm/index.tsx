import { TextInput, PasswordInput, Button, Divider, Progress } from "@mantine/core";
import { OAuthButton } from "@/components/UI/OAuthButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { google, github } from "@/utils/svgs/logos";
import { Error } from "@/components/UI/Error";
import { AccountCreationFormData, accountCreationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export type TAccountCreationForm = {
    onSuccess: (data: AccountCreationFormData) => unknown;
};

export function AccountCreationForm({ onSuccess }: TAccountCreationForm) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AccountCreationFormData>({
        mode: "onTouched",
        resolver: zodResolver(accountCreationFormDataSchema),
    });
    const onSubmit: SubmitHandler<AccountCreationFormData> = (data) => {
        // request account creation on backend, await response

        // on success
        onSuccess(data);
    };

    return (
        <div className={styles["account-creation-form-container"]}>
            <div className={styles["account-creation-form-width-controller"]}>
                <h1 className={styles["page-heading"]}>Sign up to get started</h1>
                <div className={styles["create-account"]}>
                    <Divider />

                    <div className={styles["oauth-options"]}>
                        <OAuthButton href="" icon={google} label="Sign in with Google" />
                        <OAuthButton href="" icon={github} label="Sign in with GitHub" />
                    </div>

                    <div className={styles["or-container"]}>
                        <Divider />
                        <p className={styles["or"]}>or</p>
                        <Divider />
                    </div>

                    <p className={styles["alt-signup-message"]}>Sign up using your email address</p>

                    <form
                        className={styles["form"]}
                        aria-label="Create account"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <div className={styles["form-fields-container"]}>
                            <TextInput
                                {...register("email", { required: true })}
                                {...inputProps}
                                label="Email address"
                                autoComplete="email"
                                required
                                error={<Error message={errors.email?.message || ""} />}
                            />

                            <PasswordInput
                                {...register("password", { required: true })}
                                {...inputProps}
                                label="Password"
                                autoComplete="new-password"
                                // Not sure why, but this component's <label> isn't accessible in unit
                                // tests by the 'label' prop value, so I'm setting the aria attribute
                                // too
                                aria-label="Password"
                                required
                                error={<Error message={errors.password?.message || ""} />}
                            />
                            <Progress
                                value={(100 / 8) * Math.min(8, watch("password")?.length || 0)}
                                color={(watch("password")?.length || 0) < 8 ? "red" : "green"}
                            />

                            <PasswordInput
                                {...register("confirmPassword", { required: true })}
                                {...inputProps}
                                label="Confirm password"
                                autoComplete="new-password"
                                // Using aria-label here for the same reason as the above PasswordInput
                                aria-label="Confirm password"
                                required
                                error={<Error message={errors.confirmPassword?.message || ""} />}
                            />
                        </div>

                        <p className={styles["terms-message"]}>
                            By clicking Sign Up, you agree to the{" "}
                            <Link to="/terms-and-conditions">Terms and Conditions</Link>.
                        </p>

                        <Button
                            type="submit"
                            variant="filled"
                            color="green"
                            radius={9999}
                            className={styles["sign-up-button"]}
                        >
                            Sign Up
                        </Button>
                    </form>

                    <Divider />

                    <p className={styles["login-message"]}>
                        Already have an account? <Link to="/login">Log in here</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
