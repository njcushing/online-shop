import { Input, TextInput, PasswordInput, Button, Divider } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountCreationFormDataSchema } from "./utils/zodSchema";
import { google, facebook, x, github } from "./utils/logoSVG";
import styles from "./index.module.css";

export type AccountCreationFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const oauthButtonProps = {
    variant: "outline",
    color: "black",
    radius: 9999,
    classNames: {
        inner: styles["oauth-button-inner"],
        label: styles["oauth-button-label"],
    },
};

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        error: styles["form-field-input-error"],
    },
};

const passwordInputProps = {
    classNames: {
        innerInput: styles["form-field-input"],
        error: styles["form-field-input-error"],
    },
};

const exclamationMarkSVG = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 180 180"
        width="16"
        height="16"
        aria-label="Error: "
    >
        <path
            fill="none"
            stroke="red"
            strokeWidth="16"
            strokeLinecap="round"
            d="M89,9a81,81 0 1,0 2,0zm1,38v58m0,25v1"
        />
    </svg>
);

const createInputError = (errorMessage: string | undefined) => {
    return errorMessage ? (
        <span className={styles["form-field-error-container"]}>
            {exclamationMarkSVG}
            <Input.Error component="span">{errorMessage}</Input.Error>
        </span>
    ) : null;
};

export function AccountCreationForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AccountCreationFormData>({
        mode: "onBlur",
        resolver: zodResolver(accountCreationFormDataSchema),
    });
    const onSubmit: SubmitHandler<AccountCreationFormData> = (data) => data;

    return (
        <div className={styles["create-account"]}>
            <Divider />

            <div className={styles["oauth-options"]}>
                <Button component="a" {...oauthButtonProps} leftSection={google}>
                    Sign up with Google
                </Button>
                <Button component="a" {...oauthButtonProps} leftSection={facebook}>
                    Sign up with Facebook
                </Button>
                <Button component="a" {...oauthButtonProps} leftSection={x}>
                    Sign up with X
                </Button>
                <Button component="a" {...oauthButtonProps} leftSection={github}>
                    Sign up with GitHub
                </Button>
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
                    <div className={styles["form-name-fields-container"]}>
                        <TextInput
                            {...register("firstName", { required: true })}
                            {...inputProps}
                            label="First name"
                            placeholder="First name"
                            required
                            error={createInputError(errors.firstName?.message)}
                        />

                        <TextInput
                            {...register("lastName", { required: true })}
                            {...inputProps}
                            label="Last name"
                            placeholder="Last name"
                            required
                            error={createInputError(errors.lastName?.message)}
                        />
                    </div>

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
                        {...passwordInputProps}
                        label="Password"
                        placeholder="Password"
                        required
                        error={createInputError(errors.password?.message)}
                    />

                    <PasswordInput
                        {...register("confirmPassword", { required: true })}
                        {...passwordInputProps}
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
    );
}
