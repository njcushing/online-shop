import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import styles from "./index.module.css";

export function InfoMarquee() {
    const marqueeItems = useMemo(() => {
        return <span className={styles["marquee-item"]}>text</span>;
    }, []);

    return (
        <section className={styles["info-marquee"]}>
            <div className={styles["marquee"]}>
                <div className={styles["marquee-inner"]}>
                    {Array.from({ length: 100 }).map(() => {
                        return (
                            <div className={styles["marquee-track"]} key={uuid()}>
                                {marqueeItems}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
