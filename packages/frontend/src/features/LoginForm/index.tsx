import { TextInput, PasswordInput, Button, Divider } from "@mantine/core";
import { MantineCoreExtended } from "@/components/MantineCoreExtended";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { google, facebook, x, github } from "@/utils/svgs/logos";
import { Error } from "@/components/UI/Error";
import { LoginFormData, loginFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export type TLoginForm = {
    onSuccess: (data: LoginFormData) => unknown;
};

export function LoginForm({ onSuccess }: TLoginForm) {
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
        <div className={styles["login-form-container"]}>
            <div className={styles["login-form-width-controller"]}>
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
                                {...register("email", { required: true })}
                                {...inputProps}
                                label="Email address"
                                required
                                styles={{ required: { display: "none" } }} // Hiding asterisk
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
                                styles={{ required: { display: "none" } }} // Hiding asterisk
                                error={<Error message={errors.password?.message || ""} />}
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
                        <Link to="/login">Forgot your password?</Link>
                    </p>

                    <p className={styles["create-account-message"]}>
                        Don&apos;t have an account?{" "}
                        <Link to="/create-account">Create one for free</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
