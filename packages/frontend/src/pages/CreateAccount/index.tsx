import { createContext, useMemo, useState } from "react";
import { AccountCreationForm } from "@/features/AccountCreationForm";
import { SetPersonalInformationForm } from "@/features/SetPersonalInformationForm";
import styles from "./index.module.css";

export interface ICreateAccountContext {
    accountCreationStage: number;
    setAccountCreationStage: React.Dispatch<React.SetStateAction<number>>;
}

const defaultCreateAccountContext: ICreateAccountContext = {
    accountCreationStage: 1,
    setAccountCreationStage: () => {},
};

export const CreateAccountContext = createContext<ICreateAccountContext>(
    defaultCreateAccountContext,
);

export function CreateAccount() {
    const [accountCreationStage, setAccountCreationStage] = useState<number>(
        defaultCreateAccountContext.accountCreationStage,
    );

    const pageContent = useMemo(() => {
        switch (accountCreationStage) {
            case 0:
                return <AccountCreationForm />;
            case 1:
                return <SetPersonalInformationForm />;
            case 2:
                return <SetPersonalInformationForm />;
            default:
                return null;
        }
    }, [accountCreationStage]);

    return (
        <CreateAccountContext.Provider
            value={useMemo(
                () => ({ accountCreationStage, setAccountCreationStage }),
                [accountCreationStage, setAccountCreationStage],
            )}
        >
            <div className={styles["page"]}>
                <div className={styles["page-content"]}>{pageContent}</div>
            </div>
        </CreateAccountContext.Provider>
    );
}
