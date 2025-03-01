import { Input, TextInput, PasswordInput, Button, Divider } from "@mantine/core";
import { MantineCoreExtended } from "@/components/MantineCoreExtended";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/Icons";
import { google, facebook, x, github } from "@/utils/svgs/logos";
import { LoginFormData, loginFormDataSchema } from "./utils/zodSchema";
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

export type ILoginForm = {
    onSuccess: (data: LoginFormData) => unknown;
};

export function LoginForm({ onSuccess }: ILoginForm) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        mode: "onTouched",
        resolver: zodResolver(loginFormDataSchema),
    });
    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        // request personal information update on backend, await response

        // on success
        onSuccess(data);
    };

    return (
        <>
            <h1 className={styles["page-heading"]}>Log in to continue</h1>
            <div className={styles["log-in"]}>
                <Divider />

                <div className={styles["oauth-options"]}>
                    <MantineCoreExtended.OAuthButton leftSection={google}>
                        Sign in with Google
                    </MantineCoreExtended.OAuthButton>
                    <MantineCoreExtended.OAuthButton leftSection={facebook}>
                        Sign in with Facebook
                    </MantineCoreExtended.OAuthButton>
                    <MantineCoreExtended.OAuthButton leftSection={x}>
                        Sign in with X
                    </MantineCoreExtended.OAuthButton>
                    <MantineCoreExtended.OAuthButton leftSection={github}>
                        Sign in with GitHub
                    </MantineCoreExtended.OAuthButton>
                </div>

                <Divider />

                <form
                    className={styles["form"]}
                    aria-label="Log in"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className={styles["form-fields-container"]}>
                        <TextInput
                            {...(register("email"), { required: true })}
                            {...inputProps}
                            label="Email address"
                            error={createInputError(errors.email?.message)}
                        />

                        <PasswordInput
                            {...(register("password"), { required: true })}
                            {...inputProps}
                            label="Password"
                            error={createInputError(errors.password?.message)}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="filled"
                        color="green"
                        radius={9999}
                        className={styles["log-in-button"]}
                    >
                        Log In
                    </Button>
                </form>

                <Divider />

                <p className={styles["forgot-password-message"]}>
                    <a href="/login">Forgot your password?</a>
                </p>

                <p className={styles["create-account-message"]}>
                    Don&apos;t have an account? <a href="/create-account">Create one for free</a>.
                </p>
            </div>
        </>
    );
}
