import { useContext } from "react";
import { RootContext } from "@/pages/Root";
import { useNavigate } from "react-router-dom";
import { useMatches, Image, Button } from "@mantine/core";
import styles from "./index.module.css";

const imgData = {
    wide: {
        src: "https://res.cloudinary.com/djzqtvl9l/image/upload/v1771084493/cafree/sergey-kotenev-Qx_S2YE5I1o-unsplash-1280_sd4wad.jpg",
        alt: "A metal scoop and straw sack each filled with coffee beans",
    },
    thin: {
        src: "https://res.cloudinary.com/djzqtvl9l/image/upload/v1771767255/cafree/deepthi-clicks-m3csqBPnMFw-unsplash-640_inv3au.jpg",
        alt: "Dark coffee beans falling from above into a larger pile of coffee beans",
    },
};

export function Hero() {
    const navigate = useNavigate();

    const { headerInfo } = useContext(RootContext);

    const layout = useMatches({ base: "thin", md: "wide" });
    const { src, alt } = layout === "wide" ? imgData.wide : imgData.thin;
    const availableViewportHeight = `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)`;

    return (
        <section className={styles["hero"]} data-layout={layout}>
            <div
                className={styles["hero-main-image-container"]}
                style={{
                    minHeight: layout === "wide" ? "640px" : availableViewportHeight,
                    maxHeight: availableViewportHeight,
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    className={styles["hero-image-main"]}
                    style={{
                        minHeight: layout === "wide" ? "640px" : availableViewportHeight,
                        maxHeight: availableViewportHeight,
                    }}
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
                        onClick={() => navigate("/c/samples")}
                        className={styles["shop-samples-button"]}
                    >
                        Shop Samples
                    </Button>

                    <Button
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
