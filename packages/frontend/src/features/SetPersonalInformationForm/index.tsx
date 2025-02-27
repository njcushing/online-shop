import { useState, useMemo } from "react";
import {
    Input,
    TextInput,
    NumberInput,
    Button,
    Divider,
    Progress,
    NativeSelect,
    HoverCard,
} from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/Icons";
import { PersonalInformationFormData, personalInformationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        error: styles["form-field-input-error"],
    },
};

const createInputError = (errorMessage: string | undefined) => {
    return errorMessage ? (
        <span className={styles["form-field-error-container"]}>
            <Icons.ExclamationMark />
            <Input.Error component="span">{errorMessage}</Input.Error>
        </span>
    ) : null;
};

const formStages = 2;

export function SetPersonalInformationForm() {
    const [currentStage, setCurrentStage] = useState<number>(0);

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PersonalInformationFormData>({
        mode: "onTouched",
        resolver: zodResolver(personalInformationFormDataSchema),
    });
    const onSubmit: SubmitHandler<PersonalInformationFormData> = (data) => data;

    const headingText = useMemo(() => {
        switch (currentStage) {
            case 0:
                return "Tell us more about yourself";
            case 1:
                return "What is your address";
            default:
                return null;
        }
    }, [currentStage]);

    const stage1Fields = useMemo(() => {
        return (
            <div
                className={`${styles["form-stage-container"]} ${styles[currentStage === 0 ? "in" : "out"]}`}
            >
                <div className={styles["name-fields-container"]}>
                    <TextInput
                        {...register("firstName", { setValueAs: (v) => v || undefined })}
                        {...inputProps}
                        label="First name"
                        placeholder="John"
                        error={createInputError(errors.firstName?.message)}
                        onFocus={() => setCurrentStage(0)}
                    />

                    <TextInput
                        {...register("lastName", { setValueAs: (v) => v || undefined })}
                        {...inputProps}
                        label="Last name"
                        placeholder="Smith"
                        error={createInputError(errors.lastName?.message)}
                        onFocus={() => setCurrentStage(0)}
                    />
                </div>

                <TextInput
                    {...register("phone", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Phone number"
                    placeholder="+44 7123 456789"
                    error={createInputError(errors.phone?.message)}
                    onFocus={() => setCurrentStage(0)}
                />

                <NativeSelect
                    {...register("gender")}
                    {...inputProps}
                    label="Gender"
                    data={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                        { label: "Prefer not to say", value: "unspecified" },
                    ]}
                    defaultValue="unspecified"
                    error={createInputError(errors.gender?.message)}
                    onFocus={() => setCurrentStage(0)}
                />

                <Divider />

                <fieldset className={styles["date-of-birth-fields-container"]}>
                    <legend>Date of birth</legend>

                    <Controller
                        control={control}
                        name="dob.day"
                        render={({ field }) => (
                            <NumberInput
                                {...field}
                                {...inputProps}
                                label="Day"
                                placeholder="27"
                                min={1}
                                max={31}
                                hideControls
                                error={createInputError(errors.dob?.day?.message)}
                                onChange={(v) => field.onChange(v || undefined)}
                                onFocus={() => setCurrentStage(0)}
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
                                placeholder="3"
                                min={1}
                                max={12}
                                hideControls
                                error={createInputError(errors.dob?.month?.message)}
                                onChange={(v) => field.onChange(v || undefined)}
                                onFocus={() => setCurrentStage(0)}
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
                                placeholder="1996"
                                min={1875}
                                max={new Date().getFullYear()}
                                hideControls
                                error={createInputError(errors.dob?.year?.message)}
                                onChange={(v) => field.onChange(v || undefined)}
                                onFocus={() => setCurrentStage(0)}
                            />
                        )}
                    />
                </fieldset>

                {"dob" in errors && createInputError(errors.dob!.message)}
            </div>
        );
    }, [currentStage, control, errors, register]);

    const stage2Fields = useMemo(() => {
        return (
            <div
                className={`${styles["form-stage-container"]} ${styles[currentStage === 1 ? "in" : "out"]}`}
            >
                <TextInput
                    {...register("address.line1", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Line 1"
                    error={createInputError(errors.address?.line1?.message)}
                    onFocus={() => setCurrentStage(1)}
                />

                <TextInput
                    {...register("address.line2", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Line 2"
                    error={createInputError(errors.address?.line2?.message)}
                    onFocus={() => setCurrentStage(1)}
                />

                <TextInput
                    {...register("address.townCity", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Town or City"
                    error={createInputError(errors.address?.townCity?.message)}
                    onFocus={() => setCurrentStage(1)}
                />

                <TextInput
                    {...register("address.county", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="County"
                    error={createInputError(errors.address?.county?.message)}
                    onFocus={() => setCurrentStage(1)}
                />

                <TextInput
                    {...register("address.postcode", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Postcode"
                    error={createInputError(errors.address?.postcode?.message)}
                    onFocus={() => setCurrentStage(1)}
                />
            </div>
        );
    }, [currentStage, errors, register]);

    return (
        <>
            <h1 className={styles["page-heading"]}>{headingText}</h1>

            <div className={styles["set-personal-information"]}>
                <div className={styles["progress-container"]}>
                    <p className={styles["stage-message"]}>
                        Stage {currentStage + 1} of {formStages}
                    </p>
                    <Progress
                        value={(100 / Math.max(1, formStages - 1)) * currentStage}
                        size="sm"
                    />
                </div>

                <Divider />

                <form
                    className={styles["form"]}
                    aria-label="Personal information"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div
                        className={styles["form-fields-container"]}
                        style={{
                            translate: `${currentStage * 50 * -1}%`,
                        }}
                    >
                        {stage1Fields}
                        {stage2Fields}
                    </div>

                    <div className={styles["stage-buttons-container"]}>
                        <Button
                            type="button"
                            variant="filled"
                            color="green"
                            radius={9999}
                            onClick={() => setCurrentStage(currentStage - 1)}
                            disabled={currentStage === 0}
                            className={styles["stage-button"]}
                        >
                            Prev
                        </Button>

                        <Button
                            type="button"
                            variant="filled"
                            color="green"
                            radius={9999}
                            onClick={() => setCurrentStage(currentStage + 1)}
                            disabled={currentStage === 1}
                            className={styles["stage-button"]}
                        >
                            Next
                        </Button>
                    </div>
                </form>

                <Divider />

                <HoverCard width={280} shadow="md" withArrow>
                    <HoverCard.Target>
                        <Button
                            type="button"
                            variant="filled"
                            color="orange"
                            radius={9999}
                            className={styles["skip-button"]}
                        >
                            Skip for now
                        </Button>
                    </HoverCard.Target>
                    <HoverCard.Dropdown className={styles["skip-warning-hovercard"]}>
                        <Icons.ExclamationMark
                            width="18"
                            height="18"
                            style={{ stroke: "#fdff98" }}
                        />
                        <p className={styles["skip-warning-message"]}>
                            This information will be required for shipping later.
                        </p>
                    </HoverCard.Dropdown>
                </HoverCard>
            </div>
        </>
    );
}
