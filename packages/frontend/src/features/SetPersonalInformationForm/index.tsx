import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, NumberInput, Button, Divider, Progress, HoverCard } from "@mantine/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/Icons";
import { CaretLeft } from "@phosphor-icons/react";
import { createInputError } from "@/utils/createInputError";
import { PersonalInformationFormData, personalInformationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
    },
};

const formStages = 2;

export type TSetPersonalInformationForm = {
    onSuccess: (data: PersonalInformationFormData) => unknown;
};

export function SetPersonalInformationForm({ onSuccess }: TSetPersonalInformationForm) {
    const navigate = useNavigate();

    const [currentStage, setCurrentStage] = useState<number>(0);

    const { control, register, handleSubmit, formState } = useForm<PersonalInformationFormData>({
        mode: "onTouched",
        resolver: zodResolver(personalInformationFormDataSchema),
    });
    const onSubmit: SubmitHandler<PersonalInformationFormData> = (data) => {
        // request personal information update on backend, await response

        // on success
        onSuccess(data);
    };

    const headingText = useMemo(() => {
        switch (currentStage) {
            case 0:
                return "Tell us more about yourself";
            case 1:
                return "What is your address";
            // Switch statement default case shouldn't be reachable
            /* v8 ignore next 2 */
            default:
                return null;
        }
    }, [currentStage]);

    const stage1Fields = useMemo(() => {
        const stage = 0;
        const tabIndex = currentStage !== 0 ? -1 : undefined;

        const { errors } = formState;

        return (
            <div
                className={`${styles["form-stage-container"]} ${styles[currentStage === stage ? "in" : "out"]}`}
            >
                <div className={styles["name-fields-container"]}>
                    <TextInput
                        {...register("firstName", { setValueAs: (v) => v || undefined })}
                        {...inputProps}
                        label="First name"
                        onFocus={() => setCurrentStage(stage)}
                        tabIndex={tabIndex}
                    />

                    <TextInput
                        {...register("lastName", { setValueAs: (v) => v || undefined })}
                        {...inputProps}
                        label="Last name"
                        onFocus={() => setCurrentStage(stage)}
                        tabIndex={tabIndex}
                    />
                </div>

                <TextInput
                    {...register("phone", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Phone number"
                    error={createInputError(errors.phone?.message)}
                    onFocus={() => setCurrentStage(stage)}
                    tabIndex={tabIndex}
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
                                hideControls
                                error={createInputError(errors.dob?.day?.message)}
                                onChange={(v) => field.onChange(v)}
                                onFocus={() => setCurrentStage(stage)}
                                tabIndex={tabIndex}
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
                                onFocus={() => setCurrentStage(stage)}
                                tabIndex={tabIndex}
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
                                onFocus={() => setCurrentStage(stage)}
                                tabIndex={tabIndex}
                            />
                        )}
                    />
                </fieldset>

                {createInputError(errors.dob?.root?.message)}
            </div>
        );
    }, [currentStage, control, formState, register]);

    const stage2Fields = useMemo(() => {
        const stage = 1;
        const tabIndex = currentStage !== 1 ? -1 : undefined;

        const { errors } = formState;

        return (
            <div
                className={`${styles["form-stage-container"]} ${styles[currentStage === stage ? "in" : "out"]}`}
            >
                <TextInput
                    {...register("address.line1", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Line 1"
                    onFocus={() => setCurrentStage(stage)}
                    tabIndex={tabIndex}
                />

                <TextInput
                    {...register("address.line2", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Line 2"
                    onFocus={() => setCurrentStage(stage)}
                    tabIndex={tabIndex}
                />

                <TextInput
                    {...register("address.townCity", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Town or City"
                    onFocus={() => setCurrentStage(stage)}
                    tabIndex={tabIndex}
                />

                <TextInput
                    {...register("address.county", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="County"
                    onFocus={() => setCurrentStage(stage)}
                    tabIndex={tabIndex}
                />

                <TextInput
                    {...register("address.postcode", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Postcode"
                    error={createInputError(errors.address?.postcode?.message)}
                    onFocus={() => setCurrentStage(stage)}
                    tabIndex={tabIndex}
                />
            </div>
        );
    }, [currentStage, formState, register]);

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
                        transitionDuration={560}
                    />
                </div>

                {currentStage > 0 && (
                    <Button
                        type="button"
                        aria-label="Previous stage"
                        variant="transparent"
                        radius={9999}
                        onClick={() => setCurrentStage(currentStage - 1)}
                        className={styles["return-button"]}
                    >
                        <CaretLeft size={24} color="var(--mantine-color-text, black)" />
                    </Button>
                )}

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
                            translate: `${currentStage * (100 / formStages) * -1}%`,

                            display: "grid",
                            gridTemplateColumns: `repeat(${formStages}, 1fr)`,
                            width: `${100 * formStages}%`,
                        }}
                    >
                        {stage1Fields}
                        {stage2Fields}
                    </div>

                    <Button
                        type={currentStage < formStages - 1 ? "button" : "submit"}
                        variant="filled"
                        color="green"
                        radius={9999}
                        onClick={(e) => {
                            if (currentStage < formStages - 1) {
                                setCurrentStage(currentStage + 1);

                                // Button was attempting to immediately submit after clicking 'next'
                                // from penultimate stage
                                e.preventDefault();
                            } else if (!Object.keys(formState.errors).length) {
                                handleSubmit(onSubmit);
                            }
                        }}
                        className={styles["next-button"]}
                    >
                        {currentStage < formStages - 1 ? "Next" : "Submit"}
                    </Button>
                </form>

                <Divider />

                <HoverCard width={280} shadow="md" withArrow>
                    <HoverCard.Target>
                        <Button
                            type="button"
                            variant="filled"
                            color="orange"
                            radius={9999}
                            onClick={() => navigate("/")}
                            className={styles["skip-button"]}
                        >
                            Skip for now
                        </Button>
                    </HoverCard.Target>
                    <HoverCard.Dropdown className={styles["skip-warning-hovercard"]}>
                        <Icons.ExclamationMark width="18" height="18" style={{ stroke: "black" }} />
                        <p className={styles["skip-warning-message"]}>
                            Some of this information will be required later for shipping.
                        </p>
                    </HoverCard.Dropdown>
                </HoverCard>
            </div>
        </>
    );
}
