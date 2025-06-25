import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { TextInput, Button } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { NamesFormData, namesFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export function Names() {
    const { accountDetails } = useContext(UserContext);
    const { /* data, */ awaiting } = accountDetails;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NamesFormData>({
        mode: "onTouched",
        resolver: zodResolver(namesFormDataSchema),
    });

    const onSubmit: SubmitHandler<NamesFormData> = (/* data */) => {};

    return (
        <form
            className={styles["form"]}
            aria-label="Name"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend className={styles["legend"]}>Names</legend>

                <TextInput
                    {...register("firstName", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="First name"
                    error={createInputError(errors.firstName?.message)}
                    disabled={awaiting}
                />

                <TextInput
                    {...register("lastName", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Last name"
                    error={createInputError(errors.lastName?.message)}
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
