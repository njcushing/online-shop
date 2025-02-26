import { useMemo, useState } from "react";
import { AccountCreationForm } from "@/features/AccountCreationForm";
import { SetPersonalInformationForm } from "@/features/SetPersonalInformationForm";
import styles from "./index.module.css";

export function CreateAccount() {
    const [currentStage, setCurrentStage] = useState<number>(1);

    const pageContent = useMemo(() => {
        switch (currentStage) {
            case 0:
                return (
                    <AccountCreationForm
                        onSuccess={() => {
                            setCurrentStage(1);
                        }}
                    />
                );
            case 1:
                return <SetPersonalInformationForm />;
            default:
                return null;
        }
    }, [currentStage]);

    return (
        <div className={styles["page"]}>
            <div className={styles["page-content"]}>{pageContent}</div>
        </div>
    );
}
