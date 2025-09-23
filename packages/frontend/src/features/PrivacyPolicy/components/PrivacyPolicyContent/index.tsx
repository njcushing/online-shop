import styles from "./index.module.css";

export function PrivacyPolicyContent() {
    return (
        <section className={styles["privacy-policy-content"]}>
            <div className={styles["privacy-policy-content-width-controller"]}>
                <h1 className={styles["header"]}>Privacy & Cookie Policy</h1>

                <p className={styles["last-updated"]}>
                    Last updated: <strong>September 2025</strong>
                </p>
            </div>
        </section>
    );
}
