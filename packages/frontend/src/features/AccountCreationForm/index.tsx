import { TextInput, PasswordInput, Button, Divider } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountCreationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

export type AccountCreationFormData = {
    personal: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: string;
    };
    password: string;
    confirmPassword: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    newsletterSignUp?: boolean;
    termsAgreement: boolean;
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
            <form
                className={styles["form"]}
                aria-label="Create account"
                onSubmit={handleSubmit(onSubmit)}
            >
                <fieldset>
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
                </fieldset>

                <p className={styles["terms-message"]}>
                    By clicking Sign up, you agree to the{" "}
                    <a href="/terms-and-conditions">Terms and Conditions</a>.
                </p>

                <Button type="submit" variant="filled" color="green">
                    SIGN UP
                </Button>
            </form>

            <div className={styles["or-container"]}>
                <Divider />
                <p className={styles["or"]}>or</p>
                <Divider />
            </div>
        </div>
    );
}
