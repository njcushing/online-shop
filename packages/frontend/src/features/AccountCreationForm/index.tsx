import { TextInput, PasswordInput, Button, Divider, Progress } from "@mantine/core";
import { MantineCoreExtended } from "@/components/MantineCoreExtended";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { google, facebook, x, github } from "@/utils/svgs/logos";
import { Error } from "@/components/UI/Error";
import { AccountCreationFormData, accountCreationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
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
        <>
            <h1 className={styles["page-heading"]}>Sign up to get started</h1>
            <div className={styles["create-account"]}>
                <Divider />

                <div className={styles["oauth-options"]}>
                    <MantineCoreExtended.OAuthButton leftSection={google}>
                        Sign up with Google
                    </MantineCoreExtended.OAuthButton>
                    <MantineCoreExtended.OAuthButton leftSection={facebook}>
                        Sign up with Facebook
                    </MantineCoreExtended.OAuthButton>
                    <MantineCoreExtended.OAuthButton leftSection={x}>
                        Sign up with X
                    </MantineCoreExtended.OAuthButton>
                    <MantineCoreExtended.OAuthButton leftSection={github}>
                        Sign up with GitHub
                    </MantineCoreExtended.OAuthButton>
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
                            required
                            error={<Error message={errors.email?.message || ""} />}
                        />

                        <PasswordInput
                            {...register("password", { required: true })}
                            {...inputProps}
                            label="Password"
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
                            // Using aria-label here for the same reason as the above PasswordInput
                            aria-label="Confirm password"
                            required
                            error={<Error message={errors.confirmPassword?.message || ""} />}
                        />
                    </div>

                    <p className={styles["terms-message"]}>
                        By clicking Sign up, you agree to the{" "}
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
        </>
    );
}
