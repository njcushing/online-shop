import { useEffect } from "react";
import { PrivacyPolicyContent } from "@/features/PrivacyPolicy/components/PrivacyPolicyContent";
import siteConfig from "@/siteConfig.json";
import styles from "./index.module.css";

export function PrivacyPolicy() {
    useEffect(() => {
        document.title = `Privacy Policy | ${siteConfig.title}`;
    }, []);

    return (
        <div className={styles["page"]}>
            <PrivacyPolicyContent />
        </div>
    );
}
