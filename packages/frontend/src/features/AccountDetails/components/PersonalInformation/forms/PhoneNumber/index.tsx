import { TextInput, Button } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { PhoneNumberFormData, phoneNumberFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
    },
};

export function PhoneNumber() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PhoneNumberFormData>({
        mode: "onTouched",
        resolver: zodResolver(phoneNumberFormDataSchema),
    });

    const onSubmit: SubmitHandler<PhoneNumberFormData> = (/* data */) => {};

    return (
        <form
            className={styles["form"]}
            aria-label="Name"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend>Phone number</legend>

                <TextInput
                    {...register("phone", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Phone number"
                    error={createInputError(errors.phone?.message)}
                />
            </fieldset>

            <Button
                type="submit"
                variant="filled"
                radius={9999}
                className={styles["submit-button"]}
            >
                Save changes
            </Button>
        </form>
    );
}
