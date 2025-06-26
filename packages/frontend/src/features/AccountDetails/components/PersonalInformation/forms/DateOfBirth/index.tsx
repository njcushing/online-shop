import { useContext, useCallback, useState } from "react";
import { UserContext } from "@/pages/Root";
import { NumberInput, Button } from "@mantine/core";
import {
    useForm,
    UseFormProps,
    SubmitHandler,
    Controller,
    ControllerRenderProps,
    Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

function hasNestedField(obj: unknown, path: string[]): boolean {
    if (obj === undefined || obj === null || typeof obj !== "object") return false;
    if (path.length === 0) return false;
    if (path.length === 1 && Object.hasOwn(obj, path[0])) return true;
    return hasNestedField(obj[path[0] as keyof typeof obj], path.slice(1));
}

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

export type TDateOfBirth = {
    mode: UseFormProps["mode"];
};

export function DateOfBirth({ mode = "onTouched" }: TDateOfBirth) {
    const { accountDetails } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { personal } = data || {};
    const { dob } = personal || {};
    const { day, month, year } = dob || {};

    const {
        control,
        handleSubmit,
        formState: { touchedFields, errors },
        watch,
        trigger,
    } = useForm<DateOfBirthFormData>({
        defaultValues: { dob },
        mode,
        resolver: zodResolver(dateOfBirthFormDataSchema),
    });

    const onSubmit: SubmitHandler<DateOfBirthFormData> = (/* data */) => {};

    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const formFields = watch();
    const checkHasChanged = useCallback(() => {
        const { dob: dobNew } = formFields;
        const { day: dayNew, month: monthNew, year: yearNew } = dobNew || {};

        if (dayNew !== day && !(dayNew === undefined && day === undefined))
            return setHasChanged(true);
        if (monthNew !== month && !(monthNew === undefined && month === undefined))
            return setHasChanged(true);
        if (yearNew !== year && !(yearNew === undefined && year === undefined))
            return setHasChanged(true);

        return setHasChanged(false);
    }, [day, month, year, formFields]);

    const triggerValidation = useCallback(
        (fields: Path<DateOfBirthFormData>[]) => {
            trigger(fields);
            checkHasChanged();
        },
        [trigger, checkHasChanged],
    );

    const handleValidate = useCallback(
        (
            eventType: "blur" | "change",
            field: ControllerRenderProps<DateOfBirthFormData>,
            sharedFields: string[],
        ) => {
            const isTouched = hasNestedField(touchedFields, field.name.split("."));

            // I'm asserting the type of sharedFields because any paths that are dynamically-created
            // within the schema, e.g. - for errors on a group of fields, aren't recognised in the
            // schema's type, even though they can possibly exist. Also, attempting to forcibly
            // resolve missing fields in this way is safe - it won't cause any errors.
            const fields = [
                field.name,
                ...(sharedFields as unknown as Path<DateOfBirthFormData>[]),
            ];

            if (mode === "all") {
                triggerValidation(fields);
                return;
            }

            if (mode === "onChange") {
                if (eventType === "change") triggerValidation(fields);
                return;
            }

            if (mode === "onTouched" && isTouched) {
                if (eventType === "blur") triggerValidation(fields);
                if (eventType === "change") triggerValidation(fields);
                return;
            }

            if (mode === "onBlur") {
                if (eventType === "blur") triggerValidation(fields);
            }
        },
        [mode, touchedFields, triggerValidation],
    );

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
                            onBlur={() => {
                                field.onBlur();
                                handleValidate("blur", field, ["dob.root"]);
                            }}
                            onChange={(v) => {
                                field.onChange(typeof v === "number" ? v : undefined);
                                handleValidate("change", field, ["dob.root"]);
                            }}
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
                            onBlur={() => {
                                field.onBlur();
                                handleValidate("blur", field, ["dob.root"]);
                            }}
                            onChange={(v) => {
                                field.onChange(typeof v === "number" ? v : undefined);
                                handleValidate("change", field, ["dob.root"]);
                            }}
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
                            onBlur={() => {
                                field.onBlur();
                                handleValidate("blur", field, ["dob.root"]);
                            }}
                            onChange={(v) => {
                                field.onChange(typeof v === "number" ? v : undefined);
                                handleValidate("change", field, ["dob.root"]);
                            }}
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
                disabled={awaiting || !hasChanged || hasErrors}
            >
                Save changes
            </Button>
        </form>
    );
}
