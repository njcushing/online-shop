import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "@mantine/core";
import { Logo } from "@/features/Logo";
import { LoginForm } from "@/features/LoginForm";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

const imgSrc =
    "https://res.cloudinary.com/djzqtvl9l/image/upload/v1772059481/cafree/sergey-kotenev-JHdDvYC9O1E-unsplash-1920_k16eve.jpg";
const imgAlt =
    "Brown stone-textured surface with two opposite corners containing loose coffee beans.";

export function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Login | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <div className={styles["background-image-container"]}>
                <Image src={imgSrc} alt={imgAlt} className={styles["background-image"]} />
            </div>

            <div className={styles["page-content"]}>
                <div className={styles["page-content-inner"]}>
                    <Logo size="lg" />

                    <LoginForm onSuccess={() => navigate("/")} />
                </div>
            </div>
        </div>
    );
}
