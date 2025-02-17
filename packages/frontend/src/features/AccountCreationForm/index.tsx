import { Fieldset } from "@mantine/core";
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
            <Fieldset className={styles["fieldset"]} legend="Personal information">
                <input {...register("personal.firstName", { required: true })} />
                <input {...register("personal.lastName", { required: true })} />
                <input {...register("personal.email", { required: true })} />
                <input {...register("personal.phone", { required: true })} />
                <input {...register("personal.dob", { required: true })} />
            </Fieldset>
            <input {...register("password", { required: true })} />
            <input {...register("confirmPassword", { required: true })} />
            <Fieldset className={styles["fieldset"]} legend="Address">
                <input {...register("address.line1", { required: true })} />
                <input {...register("address.line2")} />
                <input {...register("address.city", { required: true })} />
                <input {...register("address.state", { required: true })} />
                <input {...register("address.zipCode", { required: true })} />
                <input {...register("address.country", { required: true })} />
            </Fieldset>
            <input {...register("newsletterSignUp")} />
            <input {...register("termsAgreement", { required: true })} />

            <button type="submit">Submit</button>
        </form>
    );
}
