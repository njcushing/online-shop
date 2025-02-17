import { TextInput, PasswordInput } from "@mantine/core";
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
        <form
            className={styles["create-account"]}
            aria-label="Create account"
            onSubmit={handleSubmit(onSubmit)}
        >
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

            <button type="submit">Submit</button>
        </form>
    );
}
