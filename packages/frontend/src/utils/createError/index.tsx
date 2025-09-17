import { Icons } from "@/components/Icons";
import styles from "./index.module.css";

export const createError = (message: unknown): JSX.Element | null => {
    if (typeof message !== "string") return null;

    return message.length > 0 ? (
        <span className={styles["error-container"]}>
            <Icons.ExclamationMark style={{ stroke: "white" }} />
            <span role="alert" className={styles["error-message"]}>
                {message}
            </span>
        </span>
    ) : null;
};
