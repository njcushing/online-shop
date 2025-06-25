import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { TextInput, Button } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { EmailFormData, emailFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export function Email() {
    const { accountDetails } = useContext(UserContext);
    const { /* data, */ awaiting } = accountDetails;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailFormData>({
        mode: "onTouched",
        resolver: zodResolver(emailFormDataSchema),
    });

    const onSubmit: SubmitHandler<EmailFormData> = (/* data */) => {};

    return (
        <form
            className={styles["form"]}
            aria-label="Email"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend className={styles["legend"]}>Email</legend>

                <TextInput
                    {...register("email", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Email address"
                    error={createInputError(errors.email?.message)}
                    disabled={awaiting}
                />
            </fieldset>

            <Button
                type="submit"
                color="rgb(48, 48, 48)"
                variant="filled"
                radius={9999}
                className={styles["submit-button"]}
                disabled={awaiting}
            >
                Save changes
            </Button>
        </form>
    );
}
