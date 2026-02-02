import styles from "./index.module.css";

export function SustainabilityBanner() {
    return (
        <section className={styles["sustainability-banner"]}>
            <div className={styles["sustainability-text-container"]}>
                <h2 className={styles["sustainability-heading"]}>
                    We take sustainability <strong>seriously</strong>.
                </h2>

                <div className={styles["sustainability-opening-text"]}>
                    {`At Cafree, we want to bring you the best flavours the world has to offer. We
                    also believe it's our responsibility to maintain a sustainable approach to the
                    farming, packaging and transportation of our goods, so that you know every
                    cup you make is created with both love and the utmost respect for our world and
                    its inhabitants.`}
                </div>
            </div>
        </section>
    );
}
