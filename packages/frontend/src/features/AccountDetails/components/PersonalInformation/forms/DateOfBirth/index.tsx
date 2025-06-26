import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { NumberInput, Button } from "@mantine/core";
import { useForm, SubmitHandler, Controller, ControllerRenderProps, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export function DateOfBirth() {
    const { accountDetails } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { personal } = data || {};
    const { dob } = personal || {};
    const { day, month, year } = dob || {};

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<DateOfBirthFormData>({
        defaultValues: { dob },
        mode: "onBlur",
        resolver: zodResolver(dateOfBirthFormDataSchema),
    });

    const onSubmit: SubmitHandler<DateOfBirthFormData> = (/* data */) => {};

    const formFields = watch();
    const valueIsChanged = useMemo(() => {
        const { dob: dobNew } = formFields;
        const { day: dayNew, month: monthNew, year: yearNew } = dobNew || {};

        if (dayNew !== day && !(dayNew === undefined && day === undefined)) return true;
        if (monthNew !== month && !(monthNew === undefined && month === undefined)) return true;
        if (yearNew !== year && !(yearNew === undefined && year === undefined)) return true;

        return false;
    }, [day, month, year, formFields]);

    const handleBlur = (
        field: ControllerRenderProps<DateOfBirthFormData>,
        sharedFields: string[],
    ) => {
        // I'm asserting the type of the sharedFields argument within 'trigger' because any paths
        // that are dynamically-created within the schema, e.g. - for errors on a group of fields,
        // aren't recognised in the schema's type, even though they can possibly exist. Also,
        // attempting to forcibly resolve missing fields in this way is safe - it won't cause
        // any errors.
        return () => {
            field.onBlur();
            trigger([field.name, ...(sharedFields as unknown as Path<DateOfBirthFormData>[])]);
        };
    };

    const hasErrors = Object.keys(errors).length > 0;
    const hasRootError = !!errors.dob?.root;

    return (
        <form
            className={styles["form"]}
            aria-label="Date of birth"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend className={styles["legend"]}>Date of birth</legend>

                <Controller
                    control={control}
                    name="dob.day"
                    render={({ field }) => (
                        <NumberInput
                            {...field}
                            {...inputProps}
                            label="Day"
                            hideControls
                            error={createInputError(errors.dob?.day?.message) || hasRootError}
                            onBlur={handleBlur(field, ["dob.root"])}
                            onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                            disabled={awaiting}
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
                            error={createInputError(errors.dob?.month?.message) || hasRootError}
                            onBlur={handleBlur(field, ["dob.root"])}
                            onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                            disabled={awaiting}
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
                            error={createInputError(errors.dob?.year?.message) || hasRootError}
                            onBlur={handleBlur(field, ["dob.root"])}
                            onChange={(v) => field.onChange(typeof v === "number" ? v : undefined)}
                            disabled={awaiting}
                        />
                    )}
                />
            </fieldset>

            {createInputError(errors.dob?.root?.message)}

            <Button
                type="submit"
                color="rgb(48, 48, 48)"
                variant="filled"
                radius={9999}
                className={styles["submit-button"]}
                disabled={awaiting || !valueIsChanged || hasErrors}
            >
                Save changes
            </Button>
        </form>
    );
}
