import styles from "./index.module.css";

export function DecaffeinationBanner() {
    return (
        <section className={styles["decaffeination-banner"]}>
            <h2 className={styles["decaffeination-heading"]}>
                Delicious. Delightful. <strong>Decaffeinated</strong>.
            </h2>

            <p className={styles["decaffeination-opening-text"]}>
                {`At Cafree we believe decaf deserves the same care as any exceptional coffee or
                tea. That's why all the coffee and tea we make is thoughtfully decaffeinated. We
                take our high-quality, ethically-sourced beans and leaves, then remove the caffeine
                using gentle processes that preserve character, depth, and aroma. The result is
                everything you love: drinks to be enjoyed at any time of day, without compromise.`}
            </p>
        </section>
    );
}
