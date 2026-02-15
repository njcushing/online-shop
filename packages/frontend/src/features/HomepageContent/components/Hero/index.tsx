import { useContext } from "react";
import { RootContext } from "@/pages/Root";
import { useNavigate } from "react-router-dom";
import { Image, Button } from "@mantine/core";
import styles from "./index.module.css";

export function Hero() {
    const navigate = useNavigate();

    const { headerInfo } = useContext(RootContext);

    return (
        <section className={styles["hero"]}>
            <div
                className={styles["hero-main-image-container"]}
                style={{ maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)` }}
            >
                <Image
                    src="https://res.cloudinary.com/djzqtvl9l/image/upload/v1771084493/cafree/sergey-kotenev-Qx_S2YE5I1o-unsplash-1280_sd4wad.jpg"
                    alt=""
                    className={styles["hero-image-main"]}
                    style={{ maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)` }}
                />

                <span className={styles["hero-image-cover"]}></span>
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

                <div className={styles["hero-links-container"]}>
                    <Button
                        color="#242424"
                        onClick={() => navigate("/c/samples")}
                        className={styles["shop-samples-button"]}
                    >
                        Shop Samples
                    </Button>

                    <Button
                        color="#242424"
                        onClick={() => navigate("/c")}
                        className={styles["shop-full-range-button"]}
                    >
                        Shop Full Range
                    </Button>
                </div>
            </div>
        </section>
    );
}
