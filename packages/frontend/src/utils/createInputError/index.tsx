import { Input } from "@mantine/core";
import { Icons } from "@/components/Icons";
import styles from "./index.module.css";

export const createInputError = (message: unknown): JSX.Element | null => {
    if (typeof message !== "string") return null;

    return message.length > 0 ? (
        <span className={styles["input-error-container"]}>
            <Icons.ExclamationMark style={{ stroke: "white" }} />
            <Input.Error component="span" role="alert" className={styles["input-error"]}>
                {message}
            </Input.Error>
        </span>
    ) : null;
};
