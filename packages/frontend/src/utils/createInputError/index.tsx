import { Input } from "@mantine/core";
import { Icons } from "@/components/Icons";
import styles from "./index.module.css";

export const createInputError = (message?: string): JSX.Element | null => {
    return message && message.length > 0 ? (
        <span className={styles["input-error-container"]}>
            <Icons.ExclamationMark />
            <Input.Error component="span" role="alert" className={styles["input-error"]}>
                {message}
            </Input.Error>
        </span>
    ) : null;
};
