import { Fragment, useState, useEffect, useCallback } from "react";
import {
    TextInput,
    TextInputProps,
    NumberInput,
    NumberInputProps,
    PasswordInput,
    PasswordInputProps,
    Button,
    MantineStyleProp,
} from "@mantine/core";
import {
    useForm,
    UseFormProps,
    DefaultValues,
    SubmitHandler,
    Controller,
    ControllerRenderProps,
    Path,
    FieldPath,
    FieldPathValue,
    FieldValues,
} from "react-hook-form";
import { createInputError } from "@/utils/createInputError";
import _ from "lodash";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        label: styles["form-field-label"],
    },
};

type FieldType = "text" | "numeric" | "password";
type FieldTypeComponentProps = {
    text: TextInputProps;
    numeric: NumberInputProps;
    password: PasswordInputProps;
};

// 'name' must resolve to a type in the schema that is a valid 'value' in the input
type ValidPathValueTypes = FieldTypeComponentProps[keyof FieldTypeComponentProps]["value"];
type ValidPath<T extends FieldValues> =
    FieldPath<T> extends infer P
        ? P extends FieldPath<T>
            ? FieldPathValue<T, P> extends ValidPathValueTypes
                ? P
                : never
            : never
        : never;

export type Field<T extends FieldValues> = {
    type: FieldType;
    name: ValidPath<T>;
    label: string;
    description?: string;
    mode: UseFormProps<T>["mode"];
    validateOther?: string[];
    sharedValidation?: string[];
} & {
    [K in FieldType]: { type: K; classNames?: FieldTypeComponentProps[K]["classNames"] };
}[FieldType];

export type Fieldset<T extends FieldValues> = {
    legend: string;
    fields: Field<T>[];
    fullElement?: React.ReactNode;
    classNames?: {
        fieldset?: string;
        legend?: string;
        formFieldsContainer?: string;
    };
};

export type TFormBuilder<T extends FieldValues> = {
    fieldsets: Fieldset<T>[];
    ariaLabel?: string;
    defaultValues?: UseFormProps<T>["defaultValues"];
    resolver: UseFormProps<T>["resolver"];
    onSubmit?: SubmitHandler<T>;
    submitButtonText?: string;
    disabled?: boolean;
    additionalErrorPaths?: string[];
    alwaysOpen?: boolean;
    classNames?: {
        form?: string;
        editButton?: string;
        fieldsetsContainer?: string;
        additionalFieldErrorsContainer?: string;
        submitButton?: string;
    };
};

export function FormBuilder<T extends FieldValues>({
    fieldsets = [],
    ariaLabel,
    defaultValues,
    resolver,
    onSubmit,
    submitButtonText = "Submit",
    disabled,
    additionalErrorPaths = [],
    alwaysOpen,
    classNames,
}: TFormBuilder<T>) {
    const [open, setOpen] = useState<boolean>(!!alwaysOpen);

    const {
        control,
        handleSubmit,
        formState: { touchedFields, errors },
        watch,
        trigger,
        reset,
    } = useForm<T>({
        defaultValues,
        mode: "onSubmit", // Setting to most restrictive to allow user to define mode for each field
        resolver,
    });

    useEffect(() => reset(defaultValues as DefaultValues<T>), [defaultValues, reset]);

    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const checkHasChanged = useCallback(() => {
        const formFields = watch();
        const newHasChanged = fieldsets.some((fieldset) => {
            return fieldset.fields.some((field) => {
                const { name } = field;

                const currentValue = _.get(defaultValues, name);
                const newValue = _.get(formFields, name);

                if (
                    (newValue === undefined || newValue === "") &&
                    (currentValue === undefined || currentValue === "")
                ) {
                    return false;
                }
                if (newValue === currentValue) return false;

                return true;
            });
        });

        return setHasChanged(newHasChanged);
    }, [defaultValues, fieldsets, watch]);

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
            validateOther?: string[],
        ) => {
            const isTouched = _.get(touchedFields, field.name);

            // I'm asserting the type of validateOther because any paths that are
            // dynamically-created within the schema, e.g. - for errors on a group of fields, aren't
            // recognised in the schema's type, even though they can possibly exist. Also,
            // attempting to forcibly resolve missing fields in this way is safe - it won't cause
            // any errors.
            const fieldsToValidate = [field.name, ...((validateOther as Path<T>[]) || [])];

            if (mode === "all") {
                triggerValidation(fieldsToValidate);
                return;
            }

            if (mode === "onChange") {
                if (eventType === "change") triggerValidation(fieldsToValidate);
                return;
            }

            if (mode === "onTouched") {
                if (eventType === "blur") triggerValidation(fieldsToValidate);
                if (eventType === "change" && isTouched) triggerValidation(fieldsToValidate);
                return;
            }

            if (mode === "onBlur") {
                if (eventType === "blur") triggerValidation(fieldsToValidate);
            }
        },
        [touchedFields, triggerValidation],
    );

    const createInput = useCallback(
        (fieldData: Field<T>, field: ControllerRenderProps<T, ValidPath<T>>): JSX.Element => {
            const {
                type,
                name,
                label,
                description,
                mode,
                validateOther,
                sharedValidation,
                classNames: fieldClassNames,
            } = fieldData;

            const fieldError = _.get(errors, `${name}.message`);
            const sharedFieldsHaveErrors = (sharedValidation || []).filter((fieldName) => {
                return _.get(errors, fieldName);
            });

            const inputError =
                createInputError(typeof fieldError === "string" ? fieldError : undefined) ||
                sharedFieldsHaveErrors.length > 0;

            const onBlur = () => {
                field.onBlur();
                handleValidate("blur", mode, field, validateOther);
            };

            const style: MantineStyleProp = {
                visibility: open ? "initial" : "hidden",
                display: open ? "initial" : "none",
            };

            switch (type) {
                case "numeric":
                    return (
                        <NumberInput
                            {...field}
                            {...inputProps}
                            value={field.value ?? ""}
                            label={label}
                            description={description}
                            hideControls
                            error={inputError}
                            onBlur={onBlur}
                            onChange={(v) => {
                                field.onChange(typeof v === "number" ? v : undefined);
                                handleValidate("change", mode, field, validateOther);
                            }}
                            aria-hidden={!open}
                            style={style}
                            disabled={disabled}
                            classNames={{ ...fieldClassNames }}
                        />
                    );
                case "password":
                    return (
                        <PasswordInput
                            {...field}
                            {...inputProps}
                            value={field.value ?? ""}
                            label={label}
                            description={description}
                            // Not sure why, but this component's <label> isn't accessible in unit
                            // tests by the 'label' prop value, so I'm setting the aria attribute
                            // too
                            aria-label={label}
                            error={inputError}
                            onBlur={onBlur}
                            onChange={(v) => {
                                const { value } = v.target;
                                field.onChange(value.length > 0 ? value : undefined);
                                handleValidate("change", mode, field, validateOther);
                            }}
                            aria-hidden={!open}
                            style={style}
                            disabled={disabled}
                            classNames={{ ...fieldClassNames }}
                        />
                    );
                case "text":
                default:
                    return (
                        <TextInput
                            {...field}
                            {...inputProps}
                            value={field.value ?? ""}
                            label={label}
                            description={description}
                            error={inputError}
                            onBlur={onBlur}
                            onChange={(v) => {
                                const { value } = v.target;
                                field.onChange(value.length > 0 ? value : undefined);
                                handleValidate("change", mode, field, validateOther);
                            }}
                            aria-hidden={!open}
                            style={style}
                            disabled={disabled}
                            classNames={{ ...fieldClassNames }}
                        />
                    );
            }
        },
        [disabled, errors, handleValidate, open],
    );

    const additionalErrors = (() => {
        const errorElements = additionalErrorPaths.flatMap((pathName) => {
            const fieldError = _.get(errors, `${pathName}.message`);
            if (!fieldError) return [];
            return <Fragment key={pathName}>{createInputError(fieldError)}</Fragment>;
        });

        return errorElements.length > 0 ? (
            <div
                className={`${styles["additional-field-errors-container"]} ${classNames?.additionalFieldErrorsContainer}`}
            >
                {errorElements}
            </div>
        ) : null;
    })();

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form
            className={`${styles["form"]} ${classNames?.form}`}
            aria-label={ariaLabel}
            onSubmit={onSubmit && handleSubmit(onSubmit)}
            noValidate
        >
            {!alwaysOpen && (
                <Button
                    onClick={() => setOpen(!open)}
                    color="rgb(48, 48, 48)"
                    variant="filled"
                    radius={9999}
                    className={`${styles["edit-button"]} ${classNames?.editButton}`}
                    disabled={disabled}
                >
                    {open ? "Cancel" : "Edit"}
                </Button>
            )}

            <div className={`${styles["fieldsets-container"]} ${classNames?.fieldsetsContainer}`}>
                {fieldsets.map((fieldset) => {
                    const {
                        legend,
                        fields,
                        fullElement,
                        classNames: fieldsetClassNames,
                    } = fieldset;
                    return (
                        <fieldset
                            className={`${styles["fieldset"]} ${fieldsetClassNames?.fieldset}`}
                            key={legend}
                        >
                            <legend className={`${styles["legend"]} ${fieldsetClassNames?.legend}`}>
                                {legend}
                            </legend>

                            <div
                                className={`${styles["form-fields-container"]} ${fieldsetClassNames?.formFieldsContainer}`}
                            >
                                {fields.map((fieldData) => {
                                    const { name } = fieldData;

                                    return (
                                        <Controller
                                            control={control}
                                            name={name}
                                            render={({ field }) => createInput(fieldData, field)}
                                            key={name}
                                        />
                                    );
                                })}
                            </div>

                            {!open && fullElement}
                        </fieldset>
                    );
                })}
            </div>

            {open && additionalErrors}

            {open && (
                <Button
                    type="submit"
                    color="rgb(48, 48, 48)"
                    variant="filled"
                    radius={9999}
                    className={`${styles["submit-button"]} ${classNames?.submitButton}`}
                    disabled={disabled || !hasChanged || hasErrors}
                >
                    {submitButtonText}
                </Button>
            )}
        </form>
    );
}
