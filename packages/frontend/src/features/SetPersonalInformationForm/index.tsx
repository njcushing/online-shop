import { useContext } from "react";
import { Input, TextInput, Button, Divider, Progress, NativeSelect } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAccountContext } from "@/pages/CreateAccount";
import { PersonalInformationFormData, personalInformationFormDataSchema } from "./utils/zodSchema";
import styles from "./index.module.css";

const inputProps = {
    classNames: {
        input: styles["form-field-input"],
        error: styles["form-field-input-error"],
    },
};

const exclamationMarkSVG = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 180 180"
        width="16"
        height="16"
        aria-label="Error: "
    >
        <path
            fill="none"
            stroke="red"
            strokeWidth="16"
            strokeLinecap="round"
            d="M89,9a81,81 0 1,0 2,0zm1,38v58m0,25v1"
        />
    </svg>
);

const createInputError = (errorMessage: string | undefined) => {
    return errorMessage ? (
        <span className={styles["form-field-error-container"]}>
            {exclamationMarkSVG}
            <Input.Error component="span">{errorMessage}</Input.Error>
        </span>
    ) : null;
};

export function SetPersonalInformationForm() {
    const { accountCreationStage } = useContext(CreateAccountContext);

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

    return (
        <>
            <h1 className={styles["page-heading"]}>Tell us more about yourself</h1>

            <div className={styles["set-personal-information"]}>
                <div className={styles["progress-container"]}>
                    <p className={styles["stage-message"]}>Stage {accountCreationStage} of 3</p>
                    <Progress value={(100 / 3) * (accountCreationStage - 1)} size="sm" />
                </div>

                <Divider />

                <form
                    className={styles["form"]}
                    aria-label="Personal information"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className={styles["form-fields-container"]}>
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

                        <Controller
                            control={control}
                            name="dob"
                            render={({ field: { onChange, onBlur } }) => (
                                <DateInput
                                    {...register("dob", { setValueAs: (v) => v || undefined })}
                                    {...inputProps}
                                    label="Date of birth"
                                    placeholder="DD/MM/YYYY"
                                    valueFormat="DD/MM/YYYY"
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.currentTarget.blur();
                                    }}
                                    error={createInputError(errors.dob?.message)}
                                />
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="filled"
                        color="green"
                        radius={9999}
                        className={styles["proceed-button"]}
                    >
                        Submit
                    </Button>

                    <Button
                        type="button"
                        variant="filled"
                        color="green"
                        radius={9999}
                        className={styles["proceed-button"]}
                    >
                        Continue
                    </Button>
                </form>

                <Divider />
            </div>
        </>
    );
}
