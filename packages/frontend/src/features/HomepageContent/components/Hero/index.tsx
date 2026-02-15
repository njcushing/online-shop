import { Image } from "@mantine/core";
import styles from "./index.module.css";

export function Hero() {
    return (
        <section className={styles["hero"]}>
            <div className={styles["hero-main-image-container"]}>
                <Image
                    src="https://res.cloudinary.com/djzqtvl9l/image/upload/v1771084493/cafree/sergey-kotenev-Qx_S2YE5I1o-unsplash-1280_sd4wad.jpg"
                    alt=""
                    className={styles["hero-image-main"]}
                />
            </div>

            <div className={styles["hero-width-controller"]}>
                <div className={styles["hero-title-container"]}>
                    <h1 className={styles["hero-heading"]}>The home of great flavour.</h1>

                    <p className={styles["hero-subcopy"]}>
                        The one-stop shop for all your decaffeinated coffee and tea needs. Get
                        started now with one of our sample packs, or jump straight into the rest of
                        our great value offerings.
                    </p>
                </div>
            </div>
        </section>
    );
}
