import { Names } from "./forms/Names";
import { PhoneNumber } from "./forms/PhoneNumber";
import { DateOfBirth } from "./forms/DateOfBirth";
import { Email } from "./forms/Email";
import styles from "./index.module.css";

export function PersonalInformation() {
    return (
        <div className={styles["forms-container"]}>
            <h1 className={styles["header"]}>Personal Information</h1>

            <Names />
            <PhoneNumber />
            <DateOfBirth />
            <Email />
        </div>
    );
}
