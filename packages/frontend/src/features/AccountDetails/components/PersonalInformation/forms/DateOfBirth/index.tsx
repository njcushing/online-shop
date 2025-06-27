import { useContext, useCallback, useState } from "react";
import { UserContext } from "@/pages/Root";
import { NumberInput, NumberInputProps, Button } from "@mantine/core";
import {
    useForm,
    UseFormProps,
    SubmitHandler,
    Controller,
    ControllerRenderProps,
    Path,
    FieldPath,
    FieldPathValue,
    FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInputError } from "@/utils/createInputError";
import { DateOfBirthFormData, dateOfBirthFormDataSchema } from "./zodSchema";
import styles from "./index.module.css";

function getNestedField(obj: unknown, path: string[]): unknown {
    if (obj === undefined || obj === null || typeof obj !== "object") return undefined;
    if (path.length === 0) return undefined;
    if (path.length === 1 && Object.hasOwn(obj, path[0])) return obj[path[0] as keyof typeof obj];
    return getNestedField(obj[path[0] as keyof typeof obj], path.slice(1));
}

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

// 'name' must resolve to a type in the schema that is a valid 'value' in the input
type ValidPathValueTypes = NumberInputProps["value"];
type ValidPath<T extends FieldValues> =
    FieldPath<T> extends infer P
        ? P extends FieldPath<T>
            ? FieldPathValue<T, P> extends ValidPathValueTypes
                ? P
                : never
            : never
        : never;

type FieldType = {
    type: string;
    name: ValidPath<DateOfBirthFormData>;
    label: string;
    mode: UseFormProps["mode"];
    validateOther: string[];
    sharedValidation: string[];
};

const fields: FieldType[] = [
    {
        type: "numeric",
        name: "dob.day",
        label: "Day",
        mode: "onTouched",
        validateOther: ["dob.root"],
        sharedValidation: ["dob.root"],
    },
    {
        type: "numeric",
        name: "dob.month",
        label: "Month",
        mode: "onTouched",
        validateOther: ["dob.root"],
        sharedValidation: ["dob.root"],
    },
    {
        type: "numeric",
        name: "dob.year",
        label: "Year",
        mode: "onTouched",
        validateOther: ["dob.root"],
        sharedValidation: ["dob.root"],
    },
];

export function DateOfBirth() {
    const { accountDetails } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { personal } = data || {};
    const { dob } = personal || {};

    const {
        control,
        handleSubmit,
        formState: { touchedFields, errors },
        watch,
        trigger,
    } = useForm<DateOfBirthFormData>({
        defaultValues: { dob },
        mode: "onSubmit", // Setting to most restrictive to allow user to define mode for each field
        resolver: zodResolver(dateOfBirthFormDataSchema),
    });

    const onSubmit: SubmitHandler<DateOfBirthFormData> = (/* data */) => {};

    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const formFields = watch();
    const checkHasChanged = useCallback(() => {
        const fieldNames = fields.map((field) => field.name);
        fieldNames.filter((fieldName) => {
            const currentValue = getNestedField(personal, fieldName.split("."));
            const newValue = getNestedField(formFields, fieldName.split("."));

            return (
                newValue !== currentValue && !(newValue === undefined && currentValue === undefined)
            );
        });

        return setHasChanged(fieldNames.length > 0);
    }, [personal, formFields]);

    const triggerValidation = useCallback(
        (fieldsToValidate: Path<DateOfBirthFormData>[]) => {
            trigger(fieldsToValidate);
            checkHasChanged();
        },
        [trigger, checkHasChanged],
    );

    const handleValidate = useCallback(
        (
            eventType: "blur" | "change",
            mode: UseFormProps["mode"],
            field: ControllerRenderProps<DateOfBirthFormData>,
            sharedFields: string[],
        ) => {
            const isTouched = getNestedField(touchedFields, field.name.split("."));

            // I'm asserting the type of sharedFields because any paths that are dynamically-created
            // within the schema, e.g. - for errors on a group of fields, aren't recognised in the
            // schema's type, even though they can possibly exist. Also, attempting to forcibly
            // resolve missing fields in this way is safe - it won't cause any errors.
            const fieldsToValidate = [
                field.name,
                ...(sharedFields as unknown as Path<DateOfBirthFormData>[]),
            ];

            if (mode === "all") {
                triggerValidation(fieldsToValidate);
                return;
            }

            if (mode === "onChange") {
                if (eventType === "change") triggerValidation(fieldsToValidate);
                return;
            }

            if (mode === "onTouched" && isTouched) {
                if (eventType === "blur") triggerValidation(fieldsToValidate);
                if (eventType === "change") triggerValidation(fieldsToValidate);
                return;
            }

            if (mode === "onBlur") {
                if (eventType === "blur") triggerValidation(fieldsToValidate);
            }
        },
        [touchedFields, triggerValidation],
    );

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form
            className={styles["form"]}
            aria-label="Date of birth"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <fieldset className={styles["fieldset"]}>
                <legend className={styles["legend"]}>Date of birth</legend>

                {fields.map((fieldData) => {
                    const { /* type, */ name, label, mode, validateOther, sharedValidation } =
                        fieldData;

                    const fieldError = getNestedField(errors, [...name.split("."), "message"]);
                    const sharedFieldsHaveErrors = sharedValidation.filter((fieldName) => {
                        return getNestedField(errors, fieldName.split("."));
                    });

                    return (
                        <Controller
                            control={control}
                            name={name}
                            render={({ field }) => (
                                <NumberInput
                                    {...field}
                                    {...inputProps}
                                    label={label}
                                    hideControls
                                    error={
                                        createInputError(
                                            typeof fieldError === "string" ? fieldError : undefined,
                                        ) || sharedFieldsHaveErrors.length > 0
                                    }
                                    onBlur={() => {
                                        field.onBlur();
                                        handleValidate("blur", mode, field, validateOther);
                                    }}
                                    onChange={(v) => {
                                        field.onChange(typeof v === "number" ? v : undefined);
                                        handleValidate("change", mode, field, validateOther);
                                    }}
                                    disabled={awaiting}
                                />
                            )}
                            key={name}
                        />
                    );
                })}
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
