import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMatches, Image } from "@mantine/core";
import { Logo } from "@/features/Logo";
import { AccountCreationForm } from "@/features/AccountCreationForm";
import { SetPersonalInformationForm } from "@/features/SetPersonalInformationForm";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

const imgSrc =
    "https://res.cloudinary.com/djzqtvl9l/image/upload/v1771879850/cafree/sergey-kotenev-pbADWb2YAQQ-unsplash-1920_ntnzd5.jpg";
const imgAlt = "Stone-textured surface with one side covered in loose coffee beans.";

export type TCreateAccount = {
    defaultStage?: 0 | 1;
};

export function CreateAccount({ defaultStage = 0 }: TCreateAccount) {
    const navigate = useNavigate();

    const layout = useMatches({ base: "narrow", lg: "medium", xl: "wide" });

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

    return (
        <div className={styles["page"]}>
            <div className={styles["background-image-container"]}>
                <div className={styles["background-image-container-inner"]}>
                    {layout === "wide" && (
                        <Image
                            src={imgSrc}
                            alt={imgAlt}
                            className={styles["background-image-left"]}
                        />
                    )}

                    {layout !== "narrow" && (
                        <Image
                            src={imgSrc}
                            alt={imgAlt}
                            className={styles["background-image-right"]}
                        />
                    )}

                    {layout === "narrow" && (
                        <>
                            <Image
                                src={imgSrc}
                                alt={imgAlt}
                                className={styles["background-image-full"]}
                            />

                            <span className={styles["hero-image-cover"]}></span>
                        </>
                    )}
                </div>
            </div>

            <div className={styles["page-content"]}>
                <div className={styles["page-content-inner"]}>
                    <Logo size="lg" />

                    {pageContent}
                </div>
            </div>
        </div>
    );
}
