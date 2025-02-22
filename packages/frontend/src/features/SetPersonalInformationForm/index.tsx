import { useContext } from "react";
import { Input, TextInput, Button, Divider, Progress } from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
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
                                {...register("firstName")}
                                {...inputProps}
                                label="First name"
                                placeholder="John"
                                error={createInputError(errors.firstName?.message)}
                            />

                            <TextInput
                                {...register("lastName")}
                                {...inputProps}
                                label="Last name"
                                placeholder="Smith"
                                error={createInputError(errors.lastName?.message)}
                            />
                        </div>

                        <TextInput
                            {...inputProps}
                            label="Phone number"
                            placeholder="+44 7123 456789"
                        />
                    </div>

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
