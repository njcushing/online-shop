import { Input, TextInput, PasswordInput, Button, Divider, Progress } from "@mantine/core";
import { MantineCoreExtended } from "@/components/MantineCoreExtended";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/Icons";
import { google, facebook, x, github } from "@/utils/svgs/logos";
import { AccountCreationFormData, accountCreationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        error: styles["form-field-input-error"],
    },
};

const createInputError = (errorMessage: string | undefined) => {
    return errorMessage ? (
        <span className={styles["form-field-error-container"]}>
            <Icons.ExclamationMark />
            <Input.Error component="span">{errorMessage}</Input.Error>
        </span>
    ) : null;
};

export type IAccountCreationForm = {
    onSuccess: (data: AccountCreationFormData) => unknown;
};

export function AccountCreationForm({ onSuccess }: IAccountCreationForm) {
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
                            placeholder="Email address"
                            required
                            error={createInputError(errors.email?.message)}
                        />

                        <PasswordInput
                            {...register("password", { required: true })}
                            {...inputProps}
                            label="Password"
                            placeholder="Password"
                            required
                            error={createInputError(errors.password?.message)}
                        />
                        <Progress
                            value={(100 / 8) * Math.min(8, watch("password")?.length || 0)}
                            color={(watch("password")?.length || 0) < 8 ? "red" : "green"}
                        />

                        <PasswordInput
                            {...register("confirmPassword", { required: true })}
                            {...inputProps}
                            label="Confirm password"
                            placeholder="Confirm password"
                            required
                            error={createInputError(errors.confirmPassword?.message)}
                        />
                    </div>

                    <p className={styles["terms-message"]}>
                        By clicking Sign up, you agree to the{" "}
                        <a href="/terms-and-conditions">Terms and Conditions</a>.
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
                    Already have an account? <a href="/login">Log in here</a>.
                </p>
            </div>
        </>
    );
}
