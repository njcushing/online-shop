import { useContext, useCallback, useState, Fragment } from "react";
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
import { createInputError } from "@/utils/createInputError";
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

type FieldType<T extends FieldValues> = {
    type: string;
    name: ValidPath<T>;
    label: string;
    mode: UseFormProps<T>["mode"];
    validateOther: string[];
    sharedValidation: string[];
};

type TFormBuilder<T extends FieldValues> = {
    fields: FieldType<T>[];
    defaultValues?: UseFormProps<T>["defaultValues"];
    resolver: UseFormProps<T>["resolver"];
    additionalErrorPaths?: string[];
};

export function FormBuilder<T extends FieldValues>({
    fields = [],
    defaultValues,
    resolver,
    additionalErrorPaths,
}: TFormBuilder<T>) {
    const { accountDetails } = useContext(UserContext);
    const { data, awaiting } = accountDetails;

    const { personal } = data || {};

    const {
        control,
        handleSubmit,
        formState: { touchedFields, errors },
        watch,
        trigger,
    } = useForm<T>({
        defaultValues,
        mode: "onSubmit", // Setting to most restrictive to allow user to define mode for each field
        resolver,
    });

    const onSubmit: SubmitHandler<T> = (/* data */) => {};

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
    }, [fields, personal, formFields]);

    const triggerValidation = useCallback(
        (fieldsToValidate: Path<T>[]) => {
            trigger(fieldsToValidate);
            checkHasChanged();
        },
        [trigger, checkHasChanged],
    );

    const handleValidate = useCallback(
        (
            eventType: "blur" | "change",
            mode: UseFormProps<T>["mode"],
            field: ControllerRenderProps<T>,
            sharedFields: string[],
        ) => {
            const isTouched = getNestedField(touchedFields, field.name.split("."));

            // I'm asserting the type of sharedFields because any paths that are dynamically-created
            // within the schema, e.g. - for errors on a group of fields, aren't recognised in the
            // schema's type, even though they can possibly exist. Also, attempting to forcibly
            // resolve missing fields in this way is safe - it won't cause any errors.
            const fieldsToValidate = [field.name, ...(sharedFields as Path<T>[])];

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

            {additionalErrorPaths?.map((pathName) => {
                const fieldError = getNestedField(errors, [...pathName.split("."), "message"]);
                return (
                    <Fragment key={pathName}>
                        {createInputError(typeof fieldError === "string" ? fieldError : undefined)}
                    </Fragment>
                );
            })}

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
