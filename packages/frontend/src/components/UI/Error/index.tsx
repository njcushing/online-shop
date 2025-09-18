import { Icons } from "@/components/Icons";
import { IExclamationMark } from "@/components/Icons/ExclamationMark";
import styles from "./index.module.css";

export type TError = {
    message: string;
    iconProps?: IExclamationMark;
    classNames?: {
        container?: string;
        message?: string;
    };
    children?: React.ReactNode;
};

export function Error({ message, iconProps, classNames, children }: TError) {
    return message.length > 0 ? (
        <span role="alert" className={`${styles["error-container"]} ${classNames?.container}`}>
            <Icons.ExclamationMark aria-hidden="true" style={{ stroke: "white" }} {...iconProps} />

            <span className={`${styles["error-message"]} ${classNames?.message}`}>{message}</span>

            {children}
        </span>
    ) : null;
}
