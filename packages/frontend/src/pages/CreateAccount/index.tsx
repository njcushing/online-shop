import { createContext, useMemo, useState } from "react";
import { AccountCreationForm } from "@/features/AccountCreationForm";
import styles from "./index.module.css";

export interface ICreateAccountContext {
    accountCreationStage: number;
    setAccountCreationStage: React.Dispatch<React.SetStateAction<number>>;
}

const defaultCreateAccountContext: ICreateAccountContext = {
    accountCreationStage: 0,
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
                return (
                    <>
                        <h1 className={styles["page-heading"]}>Sign up to get started</h1>
                        <AccountCreationForm />
                    </>
                );
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
