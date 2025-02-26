import { useContext, useMemo } from "react";
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
import { CreateAccountContext } from "@/pages/CreateAccount";
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

export function SetPersonalInformationForm() {
    const { accountCreationStage, setAccountCreationStage } = useContext(CreateAccountContext);

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
        switch (accountCreationStage) {
            case 1:
                return "Tell us more about yourself";
            case 2:
                return "What is your address";
            default:
                return null;
        }
    }, [accountCreationStage]);

    const stage1Fields = useMemo(() => {
        return (
            <>
                <div className={styles["name-fields-container"]}>
                    <TextInput
                        {...register("firstName", { setValueAs: (v) => v || undefined })}
                        {...inputProps}
                        label="First name"
                        placeholder="John"
                        error={createInputError(errors.firstName?.message)}
                    />

                    <TextInput
                        {...register("lastName", { setValueAs: (v) => v || undefined })}
                        {...inputProps}
                        label="Last name"
                        placeholder="Smith"
                        error={createInputError(errors.lastName?.message)}
                    />
                </div>

                <TextInput
                    {...register("phone", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Phone number"
                    placeholder="+44 7123 456789"
                    error={createInputError(errors.phone?.message)}
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
                            />
                        )}
                    />
                </fieldset>

                {"dob" in errors && createInputError(errors.dob!.message)}
            </>
        );
    }, [control, errors, register]);

    const stage2Fields = useMemo(() => {
        return (
            <>
                <TextInput
                    {...register("address.line1", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Line 1"
                    error={createInputError(errors.address?.line1?.message)}
                />

                <TextInput
                    {...register("address.line2", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Line 2"
                    error={createInputError(errors.address?.line2?.message)}
                />

                <TextInput
                    {...register("address.townCity", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Town or City"
                    error={createInputError(errors.address?.townCity?.message)}
                />

                <TextInput
                    {...register("address.county", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="County"
                    error={createInputError(errors.address?.county?.message)}
                />

                <TextInput
                    {...register("address.postcode", { setValueAs: (v) => v || undefined })}
                    {...inputProps}
                    label="Postcode"
                    error={createInputError(errors.address?.postcode?.message)}
                />
            </>
        );
    }, [errors, register]);

    return (
        <>
            <h1 className={styles["page-heading"]}>{headingText}</h1>

            <div className={styles["set-personal-information"]}>
                <div className={styles["progress-container"]}>
                    <p className={styles["stage-message"]}>Stage {accountCreationStage} of 2</p>
                    <Progress value={(100 / 2) * (accountCreationStage - 1)} size="sm" />
                </div>

                <Divider />

                <form
                    className={styles["form"]}
                    aria-label="Personal information"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className={styles["form-fields-container"]}>
                        {stage1Fields}
                        {stage2Fields}
                    </div>

                    <div className={styles["stage-buttons-container"]}>
                        <Button
                            type="button"
                            variant="filled"
                            color="green"
                            radius={9999}
                            onClick={() => setAccountCreationStage(accountCreationStage - 1)}
                            disabled={accountCreationStage === 1}
                            className={styles["stage-button"]}
                        >
                            Prev
                        </Button>

                        <Button
                            type="button"
                            variant="filled"
                            color="green"
                            radius={9999}
                            onClick={() => setAccountCreationStage(accountCreationStage + 1)}
                            disabled={accountCreationStage === 2}
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
