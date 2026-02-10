import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AccountCreationForm } from "@/features/AccountCreationForm";
import { SetPersonalInformationForm } from "@/features/SetPersonalInformationForm";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export type TCreateAccount = {
    defaultStage?: 0 | 1;
};

export function CreateAccount({ defaultStage = 0 }: TCreateAccount) {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Create an Account | ${siteConfig.title}`;
    }, []);

    const [currentStage, setCurrentStage] = useState<number>(defaultStage);

    const pageContent = useMemo(() => {
        switch (currentStage) {
            case 0:
                return <AccountCreationForm onSuccess={() => setCurrentStage(1)} />;
            case 1:
                return <SetPersonalInformationForm onSuccess={() => navigate("/")} />;
            default:
                return null;
        }
    }, [navigate, currentStage]);

    return <div className={styles["page"]}>{pageContent}</div>;
}
