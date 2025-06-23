import { NumberInput, Button } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
    },
};

export function DateOfBirth() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<DateOfBirthFormData>({
        mode: "onTouched",
        resolver: zodResolver(dateOfBirthFormDataSchema),
    });

    const onSubmit: SubmitHandler<DateOfBirthFormData> = (/* data */) => {};

    return (
        <form
            className={styles["form"]}
            aria-label="Date of birth"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend>Date of birth</legend>

                <Controller
                    control={control}
                    name="dob.day"
                    render={({ field }) => (
                        <NumberInput
                            {...field}
                            {...inputProps}
                            label="Day"
                            hideControls
                            error={createInputError(errors.dob?.day?.message)}
                            onChange={(v) => field.onChange(v)}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="dob.month"
                    render={({ field }) => (
                        <NumberInput
                            {...field}
                            {...inputProps}
                            label="Month"
                            hideControls
                            error={createInputError(errors.dob?.month?.message)}
                            onChange={(v) => field.onChange(v)}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="dob.year"
                    render={({ field }) => (
                        <NumberInput
                            {...field}
                            {...inputProps}
                            label="Year"
                            hideControls
                            error={createInputError(errors.dob?.year?.message)}
                            onChange={(v) => field.onChange(v)}
                        />
                    )}
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
