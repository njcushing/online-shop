import { TextInput, PasswordInput, Button, Divider } from "@mantine/core";
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

export function AccountCreationForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AccountCreationFormData>({ resolver: zodResolver(accountCreationFormDataSchema) });
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
            >
                <div className={styles["form-fields-container"]}>
                    <div className={styles["form-name-fields-container"]}>
                        <TextInput
                            {...register("firstName", { required: true })}
                            placeholder="First name"
                            error={errors.firstName?.message}
                        />
                        <TextInput
                            {...register("lastName", { required: true })}
                            placeholder="Last name"
                            error={errors.lastName?.message}
                        />
                    </div>
                    <TextInput
                        {...register("email", { required: true })}
                        placeholder="Email address"
                        error={errors.email?.message}
                    />
                    <PasswordInput
                        {...register("password", { required: true })}
                        placeholder="Password"
                        error={errors.password?.message}
                    />
                    <PasswordInput
                        {...register("confirmPassword", { required: true })}
                        placeholder="Confirm password"
                        error={errors.confirmPassword?.message}
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
