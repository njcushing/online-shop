import { PrivacyPolicyContent } from "@/features/PrivacyPolicy/components/PrivacyPolicyContent";
import styles from "./index.module.css";

export function PrivacyPolicy() {
    return (
        <div className={styles["page"]}>
            <PrivacyPolicyContent />
        </div>
    );
}
